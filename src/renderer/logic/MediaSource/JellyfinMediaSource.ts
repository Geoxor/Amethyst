import { Ref, ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";

import { Track } from "../track.js";

const CLIENT_NAME = "Amethyst";
const CLIENT_VERSION = "1.0.0";
const PAGE_SIZE = 200;

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

export class JellyfinMediaSource extends MediaSource {
  public isConnected: Ref<boolean> = ref(false);
  public isSyncing: Ref<boolean> = ref(false);
  public ping: Ref<number | null> = ref(null);
  public syncStatus: Ref<string> = ref("Idle");
  private shouldStopSync = false;
  private userId: string | undefined;
  private accessToken: string = "";

  public serverInformation: JellyfinPublicSystemInfo | undefined;

  public constructor(protected amethyst: Amethyst, public url: string, public username: string, public password: string) {
    super(amethyst, url);
    this.type = MediaSourceType.Jellyfin;
    this.name = this.url;

    this.initialize();
  }

  private async initialize() {
    this.isConnected.value = await this.testConnection();
    if (!this.isConnected.value) {
      console.error("Failed to connect to Jellyfin server");
      return;
    }

    this.isConnected.value = await this.authenticate();
    if (!this.isConnected.value) {
      console.error("Failed to authenticate with Jellyfin server");
      return;
    }

    this.sync();
  }

  // Builds the "MediaBrowser" authorization scheme Jellyfin expects on every request
  private authorizationHeader(token = "") {
    return [
      `MediaBrowser Client="${encodeURIComponent(CLIENT_NAME)}"`,
      `Device="${encodeURIComponent(CLIENT_NAME)}"`,
      `DeviceId="${encodeURIComponent(this.uuid)}"`,
      `Version="${encodeURIComponent(CLIENT_VERSION)}"`,
      `Token="${encodeURIComponent(token)}"`,
    ].join(", ");
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

  public sync = async (): Promise<void> => {
    await this.fetchMedia();
  };

  public stopSync = (): void => {
    this.shouldStopSync = true;
  };

  public override async fetchMedia() {
    if (this.isSyncing.value || !this.userId) return;

    this.isSyncing.value = true;
    this.syncStatus.value = "Starting sync...";

    // Jellyfin issues a fresh access token (and therefore a fresh stream url) every time we
    // authenticate, so previously synced tracks from this server have to be replaced rather
    // than deduplicated by path like local/subsonic sources are.
    this.amethyst.player.queue.getList()
      .filter((track) => track.sourceType == MediaSourceType.Jellyfin && (!track.credentials || track.credentials.url == this.url))
      .forEach((track) => this.amethyst.player.queue.remove(track));

    let startIndex = 0;
    let totalCount = Infinity;

    while (startIndex < totalCount) {
      const params = new URLSearchParams({
        userId: this.userId,
        includeItemTypes: "Audio",
        recursive: "true",
        fields: "MediaSources",
        startIndex: String(startIndex),
        limit: String(PAGE_SIZE),
      });

      const response = await fetch(`${this.url}/Items?${params}`, {
        headers: { Authorization: this.authorizationHeader(this.accessToken) },
      });

      if (!response.ok) break;

      const data: JellyfinItemsResponse = await response.json();
      totalCount = data.TotalRecordCount ?? 0;
      const items = data.Items ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        this.syncStatus.value = `Fetching track: ${item.Name}`;
        this.amethyst.player.queue.add(this.createTrackFromJellyfinItem(item));

        if (this.shouldStopSync) {
          this.shouldStopSync = false;
          this.isSyncing.value = false;
          return;
        }
      }

      startIndex += PAGE_SIZE;
    }

    this.isSyncing.value = false;
  }

  private buildStreamUrl(itemId: string) {
    return `${this.url}/Audio/${itemId}/stream?static=true&api_key=${this.accessToken}`;
  }

  private buildImageUrl(itemId: string, tag: string) {
    return `${this.url}/Items/${itemId}/Images/Primary?fillWidth=128&fillHeight=128&quality=90&tag=${tag}&api_key=${this.accessToken}`;
  }

  private createTrackFromJellyfinItem(item: JellyfinItem): Track {
    const path = this.buildStreamUrl(item.Id!);
    const track = new Track(this.amethyst, path);

    track.sourceType = MediaSourceType.Jellyfin;
    track.jellyfinTrackId = item.Id;
    track.credentials = { url: this.url, userId: this.userId, accessToken: this.accessToken };
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

    track.isLoading.value = false;
    track.isLoaded.value = true;

    return track;
  }

  public override register() {
  }

  public override unregister() {
  }
}
