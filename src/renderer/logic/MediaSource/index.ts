import { v4 as uuidv4 } from "uuid";
import type { Ref } from "vue";
import { ref } from "vue";

import { Amethyst } from "@/amethyst.js";

export enum MediaSourceType {
  LocalFolder = "settings.media_source_type.local_folder",
  Subsonic = "settings.media_source_type.subsonic",
  Generic = "settings.media_source_type.generic",
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
