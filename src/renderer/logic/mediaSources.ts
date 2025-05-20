import { v4 as uuidv4 } from "uuid";
import type { Ref} from "vue";
import { ref } from "vue";

import {Amethyst} from "@/amethyst.js";
import { EventEmitter } from "@/logic/eventEmitter.js";

export enum MediaSourceType {
  LocalFolder = "settings.media_source_type.local_folder",
  Generic = "settings.media_source_type.generic",
}

export class MediaSourceManager {
  public mediaSources = ref<(MediaSource)[]>([]);

  public constructor(protected amethyst: Amethyst) {
    this.amethyst.state.settings.mediaSources.saveMediaSources.forEach(savedSource => {
      if (savedSource.path) {
        // @ts-ignore
        this.mediaSources.value.push(new LocalMediaSource(this.amethyst, savedSource.path));
      }
    });
  }

  public addLocalSource = async () => {
    const dialog = await this.amethyst.showOpenFolderDialog();
    // @ts-ignore
    dialog.filePaths.forEach(path => {
      if (dialog.canceled || !path) return;

      // Avoid adding folders if they already exist
      if (this.amethyst.state.settings.mediaSources.saveMediaSources.some(savedSource => savedSource.path == path)) return;

      const mediaSource = new LocalMediaSource(this.amethyst, path);

      if (mediaSource.type && mediaSource.path) {
        this.amethyst.state.settings.mediaSources.saveMediaSources.push({type: mediaSource.type, path: mediaSource.path, uuid: mediaSource.uuid});
        // @ts-ignore
        this.mediaSources.value.push(mediaSource);
      }
    });
  };
  
  public removeMediaSource = async (mediaSource: MediaSource) => {
    const savedMediaSource = { type: mediaSource.type, path: mediaSource.path, uuid: mediaSource.uuid };
    const index = this.mediaSources.value.findIndex(s => s.uuid == savedMediaSource.uuid);
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
    this.fetchMedia();
  }

  public register() {
    throw new Error("Not implemented");
  }

  public unregister() {
    throw new Error("Not implemented");
  }

  public fetchMedia(){
    throw new Error("Not implemented");
  };
}

export class LocalMediaSource extends MediaSource {

  private watcher: FolderWatcher | undefined;

  public constructor(protected amethyst: Amethyst, public path: string) {
    super(amethyst, path);

    this.type = MediaSourceType.LocalFolder;

    this.name = this.amethyst.getCurrentPlatform() === "mobile" ? this.path : window.path.parse(this.path).base;

    this.totalTracks = ref(0);

    if (this.amethyst.getCurrentPlatform() !== "mobile") {
      this.watcher = new FolderWatcher(this.path, this.uuid);
    }

    if (this.amethyst.getCurrentPlatform() !== "mobile") {
      this.watcher?.on("add", path => {
        this.amethyst.player.queue.add(path);
        this.amethyst.player.queue.fetchAsyncData();
        this.totalTracks.value++;
      });

      this.watcher?.on("unlink", path => {
        const track = this.amethyst.player.queue.getList().find(t => t.path == path);
        if (!track) return;
        this.amethyst.player.queue.remove(track);
        this.totalTracks.value--;
      });
    }
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
    audioFiles.forEach(path => this.amethyst.player.queue.add(path));
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