import { md5 } from "js-md5";
import { v4 as uuidv4 } from "uuid";
import { Ref, ref, watch } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";

import type { PlayerEvents } from "../player.js";
import { Track } from "../track.js";

const CLIENT_NAME = "Amethyst";
const PAGE_SIZE = 200;
// Overlap applied to incremental syncs so a track saved right at the edge of the
// previous sync's timestamp (clock skew, in-flight request) is never missed
const INCREMENTAL_SYNC_OVERLAP_MS = 5 * 60 * 1000;
// How often to report playback progress to Jellyfin while a track from this source is playing
// 10sec seems to be the default for other clients so might as well use the same 😅
const SCROBBLE_PROGRESS_INTERVAL_MS = 10 * 1000;

interface JellyfinPublicSystemInfo {
  Version?: string;
  ServerName?: string;
}

interface JellyfinAuthenticationResult {
  AccessToken?: string;
  User?: { Id?: string };
}

interface JellyfinMediaSourceInfo {
  Size?: number;
  Bitrate?: number;
  Container?: string;
}

interface JellyfinItem {
  Id?: string;
  Name?: string;
  Album?: string;
  Artists?: string[];
  RunTimeTicks?: number;
  ParentIndexNumber?: number;
  IndexNumber?: number;
  ProductionYear?: number;
  ImageTags?: { Primary?: string };
  MediaSources?: JellyfinMediaSourceInfo[];
  UserData?: { IsFavorite?: boolean };
}

interface JellyfinItemsResponse {
  Items?: JellyfinItem[];
  TotalRecordCount?: number;
}

// Persisted across restarts so we can skip re-authenticating and re-walking the whole
// library every time the app launches
interface JellyfinCache {
  accessToken: string;
  userId: string;
  items: JellyfinItem[];
  lastSyncedAt: number;
}

export class JellyfinMediaSource extends MediaSource {
  public isConnected: Ref<boolean> = ref(false);
  public isSyncing: Ref<boolean> = ref(false);
  public ping: Ref<number | null> = ref(null);
  public syncStatus: Ref<string> = ref("Idle");
  public isScrobblingEnabled: Ref<boolean>;
  private shouldStopSync = false;
  private userId: string | undefined;
  private accessToken: string = "";
  private lastSyncedAt = 0;
  private scrobbleState: { track: Track; playSessionId: string } | undefined;
  private scrobbleProgressTimer: ReturnType<typeof setInterval> | undefined;
  private scrobbleUnsubscribers: (() => void)[] = [];

  public serverInformation: JellyfinPublicSystemInfo | undefined;

  public constructor(protected amethyst: Amethyst, public url: string, public username: string, public password: string, scrobble = true) {
    super(amethyst, url);
    this.type = MediaSourceType.Jellyfin;
    this.name = this.url;
    this.isScrobblingEnabled = ref(scrobble);

    // Persist toggling the switch in Settings back into the saved source entry
    watch(this.isScrobblingEnabled, (enabled) => {
      const saved = this.amethyst.state.settings.mediaSources.saveMediaSources.find((s) => s.type == MediaSourceType.Jellyfin && s.url == this.url);
      if (saved) saved.scrobble = enabled;
    });

    this.setupScrobbling();
    this.initialize();
  }

  private async initialize() {
    this.isConnected.value = await this.testConnection();
    if (!this.isConnected.value) {
      console.error("Failed to connect to Jellyfin server");
      return;
    }

    const cache = await this.readCache();
    if (cache) {
      this.accessToken = cache.accessToken;
      this.userId = cache.userId;
      this.lastSyncedAt = cache.lastSyncedAt;
      this.hydrateFromCache(cache.items);

      if (await this.verifySession()) {
        this.isConnected.value = true;
        await this.sync(false);
        return;
      }
    }

    // No usable cached session - log in fresh. Anything hydrated from a stale cache above
    // gets reconciled (not duplicated) by the full sync below, since it upserts by item id
    this.isConnected.value = await this.authenticate();
    if (!this.isConnected.value) {
      console.error("Failed to authenticate with Jellyfin server");
      return;
    }

    await this.sync(true);
  }

  // Builds the "MediaBrowser" authorization scheme Jellyfin expects on every request
  private authorizationHeader(token = "") {
    return [
      `MediaBrowser Client="${encodeURIComponent(CLIENT_NAME)}"`,
      `Device="${encodeURIComponent(CLIENT_NAME)}"`,
      `DeviceId="${encodeURIComponent(this.uuid)}"`,
      `Version="${encodeURIComponent(this.amethyst.VERSION)}"`,
      `Token="${encodeURIComponent(token)}"`,
    ].join(", ");
  }

  /**
   * Reports playback of tracks from this source to Jellyfin (via the same Sessions/Playing
   * endpoints real clients use), so PlayCount/LastPlayedDate on the server reflect what's
   * actually being listened to. Wires into the player's existing events once for the lifetime
   * of this source; each handler is a no-op unless scrobbling is enabled and the track in
   * question actually belongs to this server.
   */
  private setupScrobbling() {
    const player = this.amethyst.player;

    const belongsToThisSource = (track?: Track): track is Track =>
      !!track && track.sourceType == MediaSourceType.Jellyfin && track.credentials?.url == this.url;

    const stopProgressTimer = () => {
      if (this.scrobbleProgressTimer) {
        clearInterval(this.scrobbleProgressTimer);
        this.scrobbleProgressTimer = undefined;
      }
    };

    const startProgressTimer = () => {
      stopProgressTimer();
      this.scrobbleProgressTimer = setInterval(() => {
        if (!this.scrobbleState) return;
        this.reportPlaybackProgress(this.scrobbleState.track, player.currentTime.value, player.isPaused.value, this.scrobbleState.playSessionId);
      }, SCROBBLE_PROGRESS_INTERVAL_MS);
    };

    const stopScrobbling = (positionSeconds: number) => {
      if (!this.scrobbleState) return;
      const { track, playSessionId } = this.scrobbleState;
      this.scrobbleState = undefined;
      stopProgressTimer();
      this.reportPlaybackStopped(track, positionSeconds, playSessionId);
    };

    const startScrobbling = (track: Track) => {
      if (!this.isScrobblingEnabled.value || !belongsToThisSource(track)) return;

      const playSessionId = uuidv4();
      this.scrobbleState = { track, playSessionId };
      this.reportPlaybackStart(track, playSessionId);
      startProgressTimer();
    };

    const onTrackFinished = (payload: PlayerEvents["player:trackFinished"]) => {
      if (this.scrobbleState && payload.track === this.scrobbleState.track) {
        stopScrobbling(player.currentTime.value);
      }
    };

    const onTrackChange = (track: PlayerEvents["player:trackChange"]) => {
      if (this.scrobbleState && this.scrobbleState.track !== track) {
        // Previous track never got a trackFinished (e.g. the user jumped straight to a
        // different one) - close out its session before opening a new one.
        stopScrobbling(player.currentTime.value);
      }
      startScrobbling(track);
    };

    const onPause = () => {
      if (!this.scrobbleState) return;
      stopProgressTimer();
      this.reportPlaybackProgress(this.scrobbleState.track, player.currentTime.value, true, this.scrobbleState.playSessionId);
    };

    const onResume = () => {
      if (!this.scrobbleState) return;
      this.reportPlaybackProgress(this.scrobbleState.track, player.currentTime.value, false, this.scrobbleState.playSessionId);
      startProgressTimer();
    };

    const onSeek = (payload: PlayerEvents["player:seek"]) => {
      if (!this.scrobbleState) return;
      this.reportPlaybackProgress(this.scrobbleState.track, payload.seekedTo, player.isPaused.value, this.scrobbleState.playSessionId);
    };

    const onStop = () => {
      stopScrobbling(player.currentTime.value);
    };

    player.on("player:trackFinished", onTrackFinished);
    player.on("player:trackChange", onTrackChange);
    player.on("player:pause", onPause);
    player.on("player:resume", onResume);
    player.on("player:seek", onSeek);
    player.on("player:stop", onStop);

    this.scrobbleUnsubscribers.push(
      () => player.off("player:trackFinished", onTrackFinished),
      () => player.off("player:trackChange", onTrackChange),
      () => player.off("player:pause", onPause),
      () => player.off("player:resume", onResume),
      () => player.off("player:seek", onSeek),
      () => player.off("player:stop", onStop),
    );
  }

  private async reportPlaybackStart(track: Track, playSessionId: string) {
    if (!track.jellyfinTrackId) return;
    try {
      await fetch(`${this.url}/Sessions/Playing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": this.authorizationHeader(this.accessToken) },
        body: JSON.stringify({
          ItemId: track.jellyfinTrackId,
          PlaySessionId: playSessionId,
          PositionTicks: 0,
          IsPaused: false,
          CanSeek: true,
          PlayMethod: "DirectPlay",
        }),
      });
    }
    catch (error) {
      console.error("Failed to report playback start to Jellyfin:", error);
    }
  }

  private async reportPlaybackProgress(track: Track, positionSeconds: number, isPaused: boolean, playSessionId: string) {
    if (!track.jellyfinTrackId) return;
    try {
      await fetch(`${this.url}/Sessions/Playing/Progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": this.authorizationHeader(this.accessToken) },
        body: JSON.stringify({
          ItemId: track.jellyfinTrackId,
          PlaySessionId: playSessionId,
          PositionTicks: Math.round(positionSeconds * 10_000_000),
          IsPaused: isPaused,
          PlayMethod: "DirectPlay",
        }),
      });
    }
    catch (error) {
      console.error("Failed to report playback progress to Jellyfin:", error);
    }
  }

  private async reportPlaybackStopped(track: Track, positionSeconds: number, playSessionId: string) {
    if (!track.jellyfinTrackId) return;
    try {
      await fetch(`${this.url}/Sessions/Playing/Stopped`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": this.authorizationHeader(this.accessToken) },
        body: JSON.stringify({
          ItemId: track.jellyfinTrackId,
          PlaySessionId: playSessionId,
          PositionTicks: Math.round(positionSeconds * 10_000_000),
        }),
      });
    }
    catch (error) {
      console.error("Failed to report playback stop to Jellyfin:", error);
    }
  }

  private testConnection = async (): Promise<boolean> => {
    try {
      const start = performance.now();
      const response = await fetch(`${this.url}/System/Info/Public`);
      if (!response.ok) return false;
      this.ping.value = Math.round(performance.now() - start);
      this.serverInformation = await response.json();
      return true;
    }
    catch (error) {
      return false;
    }
  };

  // Confirms a cached access token hasn't been revoked (password change, admin session kill, etc)
  private verifySession = async (): Promise<boolean> => {
    if (!this.accessToken || !this.userId) return false;
    try {
      const response = await fetch(`${this.url}/Users/${this.userId}`, {
        headers: { Authorization: this.authorizationHeader(this.accessToken) },
      });
      return response.ok;
    }
    catch (error) {
      return false;
    }
  };

  private authenticate = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${this.url}/Users/AuthenticateByName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.authorizationHeader(),
        },
        body: JSON.stringify({ Username: this.username, Pw: this.password }),
      });
      if (!response.ok) return false;

      const data: JellyfinAuthenticationResult = await response.json();
      this.accessToken = data.AccessToken ?? "";
      this.userId = data.User?.Id;
      return !!this.userId && !!this.accessToken;
    }
    catch (error) {
      return false;
    }
  };

  /**
   * @param full Whether to walk the entire library (also reconciles deletions) or only ask
   * the server for items touched since the last sync. Defaults to a full sync since that's
   * what a user-triggered "Sync" button should mean; startup uses `sync(false)` when a valid
   * cached session is available.
   */
  public sync = async (full = true): Promise<void> => {
    await this.fetchMedia(full);
  };

  public stopSync = (): void => {
    this.shouldStopSync = true;
  };

  public override async fetchMedia(full = true) {
    if (this.isSyncing.value || !this.userId) return;
    const userId = this.userId;

    this.isSyncing.value = true;
    this.syncStatus.value = full ? "Starting full sync..." : "Checking for updates...";

    const existingById = new Map<string, Track>();
    this.amethyst.player.queue.getList().forEach((track) => {
      if (track.sourceType == MediaSourceType.Jellyfin && track.credentials?.url == this.url && track.jellyfinTrackId) {
        existingById.set(track.jellyfinTrackId, track);
      }
    });

    const seenIds = new Set<string>();
    const fetchedItems: JellyfinItem[] = [];
    const syncStartedAt = Date.now();
    let startIndex = 0;
    let totalCount = Infinity;

    while (startIndex < totalCount) {
      const params = new URLSearchParams({
        userId,
        includeItemTypes: "Audio",
        recursive: "true",
        fields: "MediaSources",
        startIndex: String(startIndex),
        limit: String(PAGE_SIZE),
      });

      if (!full && this.lastSyncedAt) {
        params.set("minDateLastSaved", new Date(this.lastSyncedAt - INCREMENTAL_SYNC_OVERLAP_MS).toISOString());
      }

      const response = await fetch(`${this.url}/Items?${params}`, {
        headers: { Authorization: this.authorizationHeader(this.accessToken) },
      });

      if (!response.ok) break;

      const data: JellyfinItemsResponse = await response.json();
      totalCount = data.TotalRecordCount ?? 0;
      const items = data.Items ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        if (!item.Id) continue;

        this.syncStatus.value = `Fetching track: ${item.Name}`;
        seenIds.add(item.Id);
        fetchedItems.push(item);
        this.upsertTrack(item, existingById);

        if (this.shouldStopSync) {
          this.shouldStopSync = false;
          this.isSyncing.value = false;
          return;
        }
      }

      startIndex += PAGE_SIZE;
    }

    if (full) {
      // Anything that belonged to this source but wasn't seen in this walk was removed on the server
      existingById.forEach((track, id) => {
        if (!seenIds.has(id)) this.amethyst.player.queue.remove(track);
      });
      this.lastSyncedAt = syncStartedAt;
      await this.writeCache({ accessToken: this.accessToken, userId, items: fetchedItems, lastSyncedAt: this.lastSyncedAt });
    }
    else {
      // Incremental syncs only see recently touched items, so merge them into the cached
      // full snapshot instead of replacing it outright.
      const previousItems = (await this.readCache())?.items ?? [];
      const merged = new Map(previousItems.filter((item) => item.Id).map((item) => [item.Id!, item]));
      fetchedItems.forEach((item) => merged.set(item.Id!, item));
      this.lastSyncedAt = syncStartedAt;
      await this.writeCache({ accessToken: this.accessToken, userId, items: [...merged.values()], lastSyncedAt: this.lastSyncedAt });
    }

    this.isSyncing.value = false;
  }

  private hydrateFromCache(items: JellyfinItem[]) {
    items.forEach((item) => this.amethyst.player.queue.add(this.createTrackFromJellyfinItem(item)));
  }

  private upsertTrack(item: JellyfinItem, existingById: Map<string, Track>) {
    const existing = item.Id ? existingById.get(item.Id) : undefined;
    if (existing) {
      // Re-add under the (possibly new) path so the queue's path->track index stays accurate
      this.amethyst.player.queue.remove(existing);
      this.applyItemToTrack(existing, item);
      this.amethyst.player.queue.add(existing);
    }
    else {
      this.amethyst.player.queue.add(this.createTrackFromJellyfinItem(item));
    }
  }

  private buildStreamUrl(itemId: string) {
    return `${this.url}/Audio/${itemId}/stream?static=true&api_key=${this.accessToken}`;
  }

  private buildImageUrl(itemId: string, tag: string) {
    return `${this.url}/Items/${itemId}/Images/Primary?fillWidth=128&fillHeight=128&quality=90&tag=${tag}&api_key=${this.accessToken}`;
  }

  private createTrackFromJellyfinItem(item: JellyfinItem): Track {
    const track = new Track(this.amethyst, this.buildStreamUrl(item.Id!));
    track.sourceType = MediaSourceType.Jellyfin;
    this.applyItemToTrack(track, item);

    track.isLoading.value = false;
    track.isLoaded.value = true;

    return track;
  }

  private applyItemToTrack(track: Track, item: JellyfinItem) {
    track.path = this.buildStreamUrl(item.Id!);
    track.jellyfinTrackId = item.Id;
    track.credentials = { url: this.url, userId: this.userId, accessToken: this.accessToken };

    // jellyfinTrackId/sourceType are only known by this point, so the hash the constructor
    // computed (before either was set) needs recomputing - otherwise every track collides.
    // Must run before populating track fields below: generateHash() also seeds isFavorited
    // from the local favoriteTracks list, which the server's own starred flag should take priority over.
    track.generateHash();

    track.setTitle(item.Name ?? "");

    item.ImageTags?.Primary && track.setCoverArt(this.buildImageUrl(item.Id!, item.ImageTags.Primary));
    item.Album && track.setAlbum(item.Album);
    item.Artists?.length && track.setArtists(item.Artists);

    const mediaSource = item.MediaSources?.[0];
    mediaSource?.Size && track.setSize(mediaSource.Size);
    mediaSource?.Bitrate && track.setBitRate(mediaSource.Bitrate);
    mediaSource?.Container && track.setMimeType(mediaSource.Container);

    item.RunTimeTicks && track.setDuration(item.RunTimeTicks / 10_000_000);
    item.ParentIndexNumber && track.setDiscNumber(item.ParentIndexNumber);
    item.IndexNumber && track.setTrackNumber(item.IndexNumber);
    item.ProductionYear && track.setYear(item.ProductionYear);
    item.UserData?.IsFavorite && track.setIsFavorite(true);
  }

  // Lives alongside the per-track .amf metadata cache files, one JSON file per Jellyfin server
  private getCachePath() {
    return window.path.join(this.amethyst.APPDATA_PATH || "", "/amethyst/Metadata Cache", `jellyfin-sync-${md5(this.url)}.amf`);
  }

  private async readCache(): Promise<JellyfinCache | null> {
    try {
      const raw = await window.fs.readFile(this.getCachePath(), "utf8");
      return JSON.parse(raw) as JellyfinCache;
    }
    catch (error) {
      return null;
    }
  }

  private async writeCache(cache: JellyfinCache) {
    try {
      await window.fs.writeFile(this.getCachePath(), JSON.stringify(cache, null, 2));
    }
    catch (error) {
      console.error("Failed to write Jellyfin sync cache file, did you delete the 'Metadata Cache' folder?", error);
    }
  }

  public override register() {
  }

  public override async unregister() {
    this.scrobbleUnsubscribers.forEach((unsubscribe) => unsubscribe());
    this.scrobbleUnsubscribers = [];
    if (this.scrobbleProgressTimer) clearInterval(this.scrobbleProgressTimer);

    try {
      await window.fs.unlink(this.getCachePath());
    }
    catch (error) {}
  }
}
