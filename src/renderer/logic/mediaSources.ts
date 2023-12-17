import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import { Track } from "./track";
import { Ref, ref } from "vue";
import { Player } from "./player";
import { Store } from "@/state";

export enum MediaSourceType {
  LocalFolder = "settings.media_source_type.local_folder",
  Generic = "settings.media_source_type.generic",
}

export class MediaSourceManager {
  public mediaSources = ref<MediaSource[]>([]);
 
  public constructor(protected player: Player, protected store: Store) {
    this.store.settings.value.saveMediaSources.forEach(savedSource => {
      if (savedSource.path) {
        this.mediaSources.value.push(new LocalMediaSource(this.player, this.store, savedSource.path));
      }
    });
  }

  public addLocalSource = async () => {
    // dynamic import to avoid circular dependency causing a paradox
    // TODO: fix this ^
    const dialog = await (await import("@/amethyst")).amethyst.showOpenFolderDialog();
    const path = dialog.filePaths[0];
  
    if (dialog.canceled || !path) return;
  
    const mediaSource = new LocalMediaSource(this.player, this.store, path);
    
    if (mediaSource.type && mediaSource.path) {
      this.store.settings.value.saveMediaSources.push({type: mediaSource.type, path: mediaSource.path});
      this.mediaSources.value.push(mediaSource);
    }
  };
  
  public removeMediaSource = async (mediaSource: MediaSource) => {
    const savedMediaSource = { type: mediaSource.type, path: mediaSource.path };
    const index = this.store.settings.value.saveMediaSources.indexOf(savedMediaSource);
    this.store.settings.value.saveMediaSources.splice(index, 1);
    this.mediaSources.value.splice(index, 1);
  };
}

export class MediaSource {
  public type: MediaSourceType = MediaSourceType.Generic;
  public totalTracks: Ref<Number> = ref(0);  
  public totalBytes: Ref<Number> = ref(0);  
  public name: string = "generic";
  public tracks: Track[] = [];

  public constructor(protected player: Player, protected store: Store, public path: string) {
    this.fetchMedia();
  }

  private async fetchMedia() {
    const files = await window.fs.readdir(this.path);
    const audioFiles = files.filter(file => ALLOWED_AUDIO_EXTENSIONS.some(ext => file.endsWith(ext)));
    this.totalTracks.value = audioFiles.length;
    this.tracks = audioFiles.map(path => new Track(window.path.join(this.path, path)));
    
    // TODO: temporarily add tracks to the queue till theres discovery view added
    this.tracks.forEach(track => this.player.queue.add(track));
  }
}

export class LocalMediaSource extends MediaSource {
  public constructor(protected player: Player, protected store: Store, public path: string) {
    super(player, store, path);

    this.type = MediaSourceType.LocalFolder;
    this.name = window.path.parse(this.path).base;
  }
}
