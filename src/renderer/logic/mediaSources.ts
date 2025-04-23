import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import { Track } from "./track";
import type { Ref} from "vue";
import { ref } from "vue";
import type { Amethyst } from "@/amethyst";

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
    console.log(mediaSource);
    
    const savedMediaSource = { type: mediaSource.type, path: mediaSource.path };
    const index = this.amethyst.state.settings.value.saveMediaSources.findIndex(s => s.path == savedMediaSource.path);
    if (index == -1) return;
    this.amethyst.state.settings.value.saveMediaSources.splice(index, 1);
    this.mediaSources.value.splice(index, 1);
  };
}

export class MediaSource {
  public type: MediaSourceType = MediaSourceType.Generic;
  public totalTracks: Ref<Number> = ref(0);  
  public totalBytes: Ref<Number> = ref(0);  
  public name: string = "generic";
  public tracks: Track[] = [];

  public constructor(protected amethyst: Amethyst, public path: string) {
    this.fetchMedia();
  }

  private async fetchMedia() {
    const paths = await window.electron.ipcRenderer.invoke<string[]>("fetch-folder-content", [this.path, [{name: "Audio", extensions: ALLOWED_AUDIO_EXTENSIONS}]]);
    const audioFiles = paths.filter(file => ALLOWED_AUDIO_EXTENSIONS.some(ext => file.endsWith(ext)));
    this.totalTracks.value = audioFiles.length;
    this.tracks = audioFiles.map(path => new Track(this.amethyst, path));
    
    // TODO: temporarily add tracks to the queue till theres discovery view added
    this.tracks.forEach(track => this.amethyst.player.queue.add(track));
    await this.amethyst.player.queue.fetchAsyncData();
  }
}

export class LocalMediaSource extends MediaSource {
  public constructor(protected amethyst: Amethyst, public path: string) {
    super(amethyst, path);

    this.type = MediaSourceType.LocalFolder;
    this.name = window.path.parse(this.path).base;
  }
}
