import { ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";

import { EventEmitter } from "../eventEmitter.js";
import { Track } from "../track.js";

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
