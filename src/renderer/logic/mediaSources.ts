import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import type { Ref} from "vue";
import { ref } from "vue";
import type { Amethyst } from "@/amethyst";
import { EventEmitter } from "./eventEmitter";
import { v4 as uuidv4 } from "uuid";

export enum MediaSourceType {
  LocalFolder = "settings.media_source_type.local_folder",
  Generic = "settings.media_source_type.generic",
}

export class MediaSourceManager {
  public mediaSources = ref<MediaSource[]>([]);
 
  public constructor(protected amethyst: Amethyst) {
    this.amethyst.state.settings.value.saveMediaSources.forEach(savedSource => {
      if (savedSource.path) {
        this.mediaSources.value.push(new LocalMediaSource(this.amethyst, savedSource.path));
      }
    });
  }

  public addLocalSource = async () => {
    const dialog = await this.amethyst.showOpenFolderDialog();
    const path = dialog.filePaths[0];
  
    if (dialog.canceled || !path) return;
  
    // Avoid adding folders if they already exist
    if (this.amethyst.state.settings.value.saveMediaSources.some(savedSource => savedSource.path == path)) return;

    const mediaSource = new LocalMediaSource(this.amethyst, path);
    
    if (mediaSource.type && mediaSource.path) {
      this.amethyst.state.settings.value.saveMediaSources.push({type: mediaSource.type, path: mediaSource.path});
      this.mediaSources.value.push(mediaSource);
    }
  };
  
  public removeMediaSource = async (mediaSource: MediaSource) => {
    mediaSource.unregister();
    const savedMediaSource = { type: mediaSource.type, path: mediaSource.path };
    const index = this.amethyst.state.settings.value.saveMediaSources.findIndex(s => s.path == savedMediaSource.path);
    console.log(index); 
    if (index == -1) return;
    this.amethyst.state.settings.value.saveMediaSources.splice(index, 1);
    this.mediaSources.value.splice(index, 1);

  };
}

export class MediaSource {
  protected uuid: string = uuidv4();
  public type: MediaSourceType = MediaSourceType.Generic;
  public totalTracks: Ref<number> = ref(0);  
  public totalBytes: Ref<number> = ref(0);  
  public name: string = "generic";

  public constructor(protected amethyst: Amethyst, public path: string) {
    this.fetchMedia();
  }

  public fetchMedia(){
    throw new Error("Not implemented");
  };

  public register() {
    window.electron.ipcRenderer.invoke("watch-folder", [this.path, this.uuid]);
  }

  public unregister() {
    window.electron.ipcRenderer.invoke("unwatch-folder", [this.path, this.uuid]);
  }
}

export class LocalMediaSource extends MediaSource {
  private watcher: FolderWatcher;

  public constructor(protected amethyst: Amethyst, public path: string) {
    super(amethyst, path);

    this.type = MediaSourceType.LocalFolder;
    this.name = window.path.parse(this.path).base;
    this.watcher = new FolderWatcher(this.path, this.uuid);
    this.totalTracks = ref(0);

    this.watcher.on("add", path => {
      this.amethyst.player.queue.add(path);
      this.totalTracks.value++;
    });

    this.watcher.on("unlink", path => {
      const track = this.amethyst.player.queue.getList().find(t => t.path == path);
      if (!track) return;
      this.amethyst.player.queue.remove(track);
      this.totalTracks.value--;
    });
  }

  public override async fetchMedia() {
    const paths = await window.electron.ipcRenderer.invoke<string[]>("fetch-folder-content", [this.path, [{name: "Audio", extensions: ALLOWED_AUDIO_EXTENSIONS}]]);
    const audioFiles = paths.filter(file => ALLOWED_AUDIO_EXTENSIONS.some(ext => file.endsWith(ext)));
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