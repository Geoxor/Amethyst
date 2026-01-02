import { SubsonicAPI } from "subsonic-api";
import { v4 as uuidv4 } from "uuid";
import type { Ref } from "vue";
import { ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { EventEmitter } from "@/logic/eventEmitter.js";

import { Track } from "./track.js";

export enum MediaSourceType {
  LocalFolder = "settings.media_source_type.local_folder",
  Subsonic = "settings.media_source_type.subsonic",
  Generic = "settings.media_source_type.generic",
}

export class MediaSourceManager {
  public mediaSources = ref<(MediaSource)[]>([]);

  public constructor(protected amethyst: Amethyst) {
    this.amethyst.state.settings.mediaSources.saveMediaSources.forEach((savedSource) => {
      if (savedSource.path) {
        // @ts-ignore
        this.mediaSources.value.push(new LocalMediaSource(this.amethyst, savedSource.path));
      }
    });
  }

  public addLocalSource = async () => {
    const dialog = await this.amethyst.showOpenFolderDialog();
    // @ts-ignore
    dialog.filePaths.forEach((path) => {
      if (dialog.canceled || !path) return;

      // Avoid adding folders if they already exist
      if (this.amethyst.state.settings.mediaSources.saveMediaSources.some((savedSource) => savedSource.path == path)) return;

      const mediaSource = new LocalMediaSource(this.amethyst, path);

      if (mediaSource.type && mediaSource.path) {
        this.amethyst.state.settings.mediaSources.saveMediaSources.push({ type: mediaSource.type, path: mediaSource.path, uuid: mediaSource.uuid });
        // @ts-ignore
        this.mediaSources.value.push(mediaSource);
      }
    });
  };

  public addSubsonicSource = async (url: string, apiKey: string) => {
    const mediaSource = new SubsonicMediaSource(this.amethyst, url, apiKey);
    console.log(mediaSource);
    this.mediaSources.value.push(mediaSource);
  };

  public removeMediaSource = async (mediaSource: MediaSource) => {
    const savedMediaSource = { type: mediaSource.type, path: mediaSource.path, uuid: mediaSource.uuid };
    const index = this.mediaSources.value.findIndex((s) => s.uuid == savedMediaSource.uuid);
    if (index == -1) return;
    mediaSource.unregister();
    this.amethyst.state.settings.mediaSources.saveMediaSources.splice(index, 1);
    this.mediaSources.value.splice(index, 1);
  };
}

export class MediaSource {
  public uuid: string = uuidv4();
  public type: MediaSourceType = MediaSourceType.Generic;
  public totalTracks: Ref<number> = ref(0);
  public totalBytes: Ref<number> = ref(0);
  public name: string = "generic";

  public constructor(protected amethyst: Amethyst, public path: string) {

  }

  public register() {
    throw new Error("Not implemented");
  }

  public unregister() {
    throw new Error("Not implemented");
  }

  public fetchMedia() {
    throw new Error("Not implemented");
  };
}

export class SubsonicMediaSource extends MediaSource {
  public api: SubsonicAPI;
  public username: string;
  public password: string;
  public constructor(protected amethyst: Amethyst, public url: string, public apiKey: string) {
    super(amethyst, url);

    this.type = MediaSourceType.Subsonic;

    // temporary
    this.url = "http://xnet-unraid.local:4533";
    this.name = this.url;
    this.username = "admin";
    this.password = "admin";
    this.totalTracks = ref(0);

    this.api = new SubsonicAPI({
      url: this.url,
      auth: {
        username: this.username,
        password: this.password,
      },
    });

    this.fetchMedia();
  }

  public override async fetchMedia() {
    const { randomSongs } = await this.api.getRandomSongs({ size: 100000 });
    console.log("fetching Subsonic media");
    console.log(randomSongs);

    randomSongs.song?.forEach((song) => {
      const path = `${this.url}/rest/stream.view?id=${song.id}&u=${this.username}&p=${this.password}&p=demo&v=1.16.1&c=Amethyst`;
      console.log("adding song from Subsonic:", path);
      const track = new Track(this.amethyst, path);

      track.sourceType = MediaSourceType.Subsonic;
      track.setTitle(song.title);
      track.setDuration(song.duration ? song.duration * 1000 : 0);

      // low resolution cover art for performance
      song.coverArt && track.setCoverArt(`${this.url}/rest/getCoverArt.view?id=${song.coverArt}&u=${this.username}&p=${this.password}&size=128&v=1.16.1&c=Amethyst`);
      song.album && track.setAlbum(song.album);
      song.artist && track.setArtists([song.artist]);
      song.size && track.setSize(song.size);
      song.bitRate && track.setBitRate(song.bitRate);

      track.isLoading.value = false;
      track.isLoaded.value = true;

      this.amethyst.player.queue.add(track);
    });
  }

  public override register() {

  }
}

export class LocalMediaSource extends MediaSource {
  private watcher: FolderWatcher | FolderWatcherMobile;

  public constructor(protected amethyst: Amethyst, public path: string) {
    super(amethyst, path);

    this.type = MediaSourceType.LocalFolder;
    this.name = this.amethyst.getCurrentPlatform() === "mobile" ? this.path : window.path.parse(this.path).base;
    this.totalTracks = ref(0);
    this.watcher = this.amethyst.getCurrentPlatform() === "mobile" ? new FolderWatcherMobile(this.path, this.uuid) : new FolderWatcher(this.path, this.uuid);

    this.watcher.on("add", (path) => {
      const track = new Track(this.amethyst, path);
      track.sourceType = MediaSourceType.LocalFolder;
      this.amethyst.player.queue.add(track);
      this.amethyst.player.queue.fetchAsyncData();
      this.totalTracks.value++;
    });

    this.watcher.on("unlink", (path) => {
      const track = this.amethyst.player.queue.getList().find((t) => t.path == path);
      if (!track) return;

      this.amethyst.player.queue.remove(track);
      this.totalTracks.value--;
    });

    this.fetchMedia();
  }

  public override register() {
    if (this.amethyst.getCurrentPlatform() !== "mobile") {
      window.electron.ipcRenderer.invoke("watch-folder", [this.path, this.uuid]);
    }
  }

  public override unregister() {
    if (this.amethyst.getCurrentPlatform() !== "mobile") {
      window.electron.ipcRenderer.invoke("unwatch-folder", [this.path, this.uuid]);
    }
  }

  public override async fetchMedia() {
    const audioFiles = await this.amethyst.readFilesFromPath(this.path);
    audioFiles.forEach((path) => this.amethyst.player.queue.add(path));
    this.totalTracks.value = audioFiles.length;
    await this.amethyst.player.queue.fetchAsyncData();
  }
}

class FolderWatcher extends EventEmitter<{
  add: string;
  unlink: string;
  change: string;
}> {
  public constructor(private path: string, private uuid: string) {
    super();

    window.electron.ipcRenderer.invoke("watch-folder", [this.path, this.uuid]);

    window.electron.ipcRenderer.on<[string, string]>("watch:add", ([path, uuid]) => {
      if (uuid !== this.uuid) return;
      this.emit("add", path);
    });

    window.electron.ipcRenderer.on<[string, string]>("watch:unlink", ([path, uuid]) => {
      if (uuid !== this.uuid) return;
      this.emit("unlink", path);
    });

    window.electron.ipcRenderer.on<[string, string]>("watch:change", ([path, uuid]) => {
      if (uuid !== this.uuid) return;
      this.emit("change", path);
    });
  }
}

class FolderWatcherMobile extends EventEmitter<{
  add: string;
  unlink: string;
  change: string;
}> {
  public constructor(private path: string, private uuid: string) {
    super();

    // TODO: implement Mobile folder watching.
  }
}
