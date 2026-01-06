import SubsonicAPI, { Child, SubsonicBaseResponse } from "subsonic-api";
import { Ref, ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";

import { Track } from "../track.js";

export class SubsonicMediaSource extends MediaSource {
  public api: SubsonicAPI;
  public isConnected: Ref<boolean> = ref(false);
  public isScanning: Ref<boolean> = ref(false);
  public isSyncing: Ref<boolean> = ref(false);
  public ping: Ref<number | null> = ref(null);
  public syncStatus: Ref<string> = ref("Idle");
  private shouldStopSync = false;

  public serverInformation: SubsonicBaseResponse | undefined;
  public constructor(protected amethyst: Amethyst, public url: string, public username: string, public password: string) {
    super(amethyst, url);
    this.type = MediaSourceType.Subsonic;
    this.name = this.url;
    this.api = new SubsonicAPI({
      url: this.url,
      auth: {
        username: this.username,
        password: this.password,
      },
    });

    this.initialize();
  }

  public fetchFavoriteSongs() {
    this.api.getStarred()
      .then((response) => response.starred?.song || [])
      .then((songs) => {
        songs.forEach((song) => {
          const track = this.createTrackFromSubsonicSong(song);
          track.setIsFavorite(true);
          this.amethyst.player.queue.add(track);
        });
      });
  }

  private async initialize() {
    this.isConnected.value = await this.testConnection();
    if (!this.isConnected.value) {
      console.error("Failed to connect to Subsonic server");
      return;
    }

    setInterval(() => this.getScanStatus(), 1000);
    this.getScanStatus();
    this.sync();
    this.fetchFavoriteSongs();
  }

  public sync = async (): Promise<void> => {
    await this.fetchMedia();
  };

  public stopSync = (): void => {
    this.shouldStopSync = true;
  };

  private testConnection = async (): Promise<boolean> => {
    try {
      const response = await this.api.ping();
      this.serverInformation = response;
      console.log(response);
      return true;
    }
    catch (error) {
      return false;
    }
  };

  public async getScanStatus() {
    const start = performance.now();
    const response = await this.api.getScanStatus();
    this.ping.value = Math.round(performance.now() - start);
    this.isScanning.value = response.scanStatus.scanning;
  }

  public override async fetchMedia() {
    if (this.isSyncing.value) return;

    this.isSyncing.value = true;
    this.syncStatus.value = "Starting sync...";

    const { indexes } = await this.api.getIndexes();
    const { index } = indexes;

    if (index) {
      for (const character of index) {
        for (const artist of character.artist || []) {
          this.syncStatus.value = `Fetching artist: ${artist.name}`;
          const { artist: artistDetails } = await this.api.getArtist({ id: artist.id });
          for (const album of artistDetails.album || []) {
            const { album: albumDetails } = await this.api.getAlbum({ id: album.id });
            for (const song of albumDetails.song || []) {
              this.amethyst.player.queue.add(this.createTrackFromSubsonicSong(song));

              if (this.shouldStopSync) {
                this.shouldStopSync = false;
                this.isSyncing.value = false;
                return;
              }
            }
          }
        };
      }
    }

    this.isSyncing.value = false;

    // const { randomSongs } = await this.api.getRandomSongs({ size: 10 });
    // randomSongs.song?.forEach((song) => this.amethyst.player.queue.add(this.createTrackFromSubsonicSong(song)));
  }

  private createTrackFromSubsonicSong(song: Child): Track {
    const path = `${this.url}/rest/stream.view?id=${song.id}&u=${this.username}&p=${this.password}&p=demo&v=1.16.1&c=Amethyst`;
    const track = new Track(this.amethyst, path);

    track.sourceType = MediaSourceType.Subsonic;
    track.subsonicTrackId = song.id;
    track.credentials = { username: this.username, password: this.password, url: this.url };
    track.setTitle(song.title);

    // low resolution cover art for performance
    song.coverArt && track.setCoverArt(`${this.url}/rest/getCoverArt.view?id=${song.coverArt}&u=${this.username}&p=${this.password}&size=128&v=1.16.1&c=Amethyst`);
    song.album && track.setAlbum(song.album);
    song.artist && track.setArtists([song.artist]);
    song.size && track.setSize(song.size);
    song.bitRate && track.setBitRate(song.bitRate * 1000);
    song.duration && track.setDuration(song.duration);
    song.contentType && track.setMimeType(song.contentType);
    song.discNumber && track.setDiscNumber(song.discNumber);
    song.track && track.setTrackNumber(song.track);
    song.year && track.setYear(song.year);
    song.starred && track.setIsFavorite(true);

    track.isLoading.value = false;
    track.isLoaded.value = true;

    return track;
  }

  public override register() {
  }

  public override unregister() {
  }
}
