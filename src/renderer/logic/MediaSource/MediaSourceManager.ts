import { ref } from "vue";

import { Amethyst } from "@/amethyst.js";
import { MediaSource, MediaSourceType } from "@/logic//MediaSource/index.js";
import { LocalMediaSource } from "@/logic//MediaSource/LocalMediaSource.js";
import { SubsonicMediaSource } from "@/logic//MediaSource/SubsonicMediaSource.js";

export class MediaSourceManager {
  public mediaSources = ref<(MediaSource)[]>([]);

  public constructor(protected amethyst: Amethyst) {
    this.amethyst.state.settings.mediaSources.saveMediaSources.forEach((savedSource) => {
      if (savedSource.type == MediaSourceType.LocalFolder) {
        // @ts-ignore
        this.mediaSources.value.push(new LocalMediaSource(this.amethyst, savedSource.path));
      }

      if (savedSource.type == MediaSourceType.Subsonic) {
        // @ts-ignore
        this.mediaSources.value.push(new SubsonicMediaSource(this.amethyst, savedSource.url, savedSource.username, savedSource.password));
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

  public addSubsonicSource = async (url: string, username: string, password: string) => {
    const mediaSource = new SubsonicMediaSource(this.amethyst, url, username, password);

    this.amethyst.state.settings.mediaSources.saveMediaSources.push({
      type: mediaSource.type,
      url: mediaSource.url,
      username: mediaSource.username,
      password: mediaSource.password,
    });
    // @ts-ignore
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
