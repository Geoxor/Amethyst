import SubsonicAPI from "subsonic-api";
import { Ref, ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";

import { Track } from "../track.js";

export class SubsonicMediaSource extends MediaSource {
  public api: SubsonicAPI;
  public isConnected: Ref<boolean> = ref(false);
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

  private async initialize() {
    this.isConnected.value = await this.testConnection();
    if (!this.isConnected.value) {
      console.error("Failed to connect to Subsonic server");
      return;
    }
    await this.fetchMedia();
  }

  public testConnection = async (): Promise<boolean> => {
    try {
      const response = await this.api.ping();
      console.log(response);
      return true;
    }
    catch (error) {
      return false;
    }
  };

  public override async fetchMedia() {
    const { randomSongs } = await this.api.getRandomSongs({ size: 10 });

    randomSongs.song?.forEach((song) => {
      const path = `${this.url}/rest/stream.view?id=${song.id}&u=${this.username}&p=${this.password}&p=demo&v=1.16.1&c=Amethyst`;
      const track = new Track(this.amethyst, path);

      track.sourceType = MediaSourceType.Subsonic;
      track.setTitle(song.title);

      // low resolution cover art for performance
      song.coverArt && track.setCoverArt(`${this.url}/rest/getCoverArt.view?id=${song.coverArt}&u=${this.username}&p=${this.password}&size=128&v=1.16.1&c=Amethyst`);
      song.album && track.setAlbum(song.album);
      song.artist && track.setArtists([song.artist]);
      song.size && track.setSize(song.size);
      song.bitRate && track.setBitRate(song.bitRate);
      song.duration && track.setDuration(song.duration);

      track.isLoading.value = false;
      track.isLoaded.value = true;

      this.amethyst.player.queue.add(track);
    });
  }

  public override register() {
  }
}
