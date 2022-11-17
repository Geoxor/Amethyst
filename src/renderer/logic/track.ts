import { IMetadata } from "src/main/metadata";
import { ref } from "vue";
import { bytesToHuman, secondsToColinHuman, secondsToHuman } from "./formating";

export enum LoadStatus {
  Loading,
  Loaded
}

export type LoadState<T> = {
  state: LoadStatus.Loading,
  data: undefined
} | {
  state: LoadStatus.Loaded,
  data: T
};

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  public static ALLOWED_EXTENSIONS = ["ogg", "ogv", "oga", "ogx", "ogm", "spx", "opus", "wav", "wave", "m4a", "m4b", "m4p", "m4r", "m4v", "3gp", "flac", "opus", "aac", "aiff", "mp3", "m4a"];
  public metadata: LoadState<IMetadata> = { state: LoadStatus.Loading, data: undefined };
  public cover: { state: LoadStatus, data: string | undefined } = { state: LoadStatus.Loading, data: undefined };
  public isLoading = ref(false);
  public isLoaded = ref(false);
  public hasErrored = ref(false);

  public constructor(public path: string) {
    if (!Track.ALLOWED_EXTENSIONS.some(ext => path.endsWith(ext)))
      throw new Error(`Given file extension does not match any of the allowed types [${Track.ALLOWED_EXTENSIONS.join(", ")}]`);

  }
  /**
   * Fetches the metadata for a given track
   */
  public fetchMetadata = async () => {
    try {
      const amethyst = await import("../amethyst");
      this.metadata.data = await amethyst.useElectron().getMetadata(this.path);
      this.metadata.state = LoadStatus.Loaded;
    } catch (error) {
      this.hasErrored.value = true;
    }
  };

  /**
   * Fetches the resized cover art in base64
   */
  public fetchCover = async () => {
    try {
      const amethyst = await import("../amethyst");
      const data = await amethyst.useElectron().getCover(this.path);
      this.cover.data = data ? `data:image/webp;base64,${data}` : undefined;
      this.cover.state = LoadStatus.Loaded;
    } catch (error) {
      this.hasErrored.value = true;
    }
  };

  /**
   * Fetches all async data concurrently
   */
  public fetchAsyncData = async () => {
    this.isLoaded.value = false;
    this.isLoading.value = true;
    await Promise.allSettled([this.fetchCover(), this.fetchMetadata()]);
    this.isLoading.value = false;
    this.isLoaded.value = true;
  };

  /**
   * @returns The metadata object for this tune if it's loaded
   * @throws Error message if the object hasn't loaded yet
   */
  public getMetadata() {
    if (this.metadata.state != LoadStatus.Loaded) return;
    return this.metadata.data;
  };

  /**
   * @returns The cover string for this tune if it's loaded
   * @throws Error message if the object hasn't loaded yet
   */
  public getCover() {
    if (this.cover.state != LoadStatus.Loaded) return;
    return this.cover.data;
  };

  public getTitle(){
    return this.metadata.data?.common.title;
  }

  /**
   * @returns The filename of a file from the full path
   * @example "02. Daft Punk - Get Lucky.flac"
   */
  public getFilename() {
    return this.path.substring(Math.max(this.path.lastIndexOf("\\"), this.path.lastIndexOf("/")) + 1);
  };

  /**
   * @returns The filesize in a human readable string
   * @example "2.42 MB"
   */
  public getFilesizeFormatted(){
    return bytesToHuman(this.getMetadata()?.size || 0);
  }

  /**
   * @returns The title from metadata and falls back to the filename
   * @example "Get Lucky" || "02. Daft Punk - Get Lucky.flac"
   */
  public getTitleFormatted() {
    return this.getMetadata()?.common.title || this.getFilename();
  };

  /**
   * @returns The artist(s) (joined with a "&") from metadata and falls back to "uknown artist"
   * @example "Daft Punk", "Virtual Riot & Panda Eyes",
   */
  public getArtistsFormatted() {
    return this.getMetadata()?.common.artists?.join(" & ");
  };

  public getAlbumFormatted() {
    return this.getMetadata()?.common.album;
  }

  /**
   * @returns The seconds of the track in float
   * @example 15.02400204024 || 0
   */
  public getDurationSeconds() {
    return this.getMetadata()?.format.duration || 0;
  };

  /**
   * @returns The seconds of the track in a human readable format
   * @example "0:15", "1:54"
   */
  public getDurationFormatted(colinNotation?: boolean) {
    return colinNotation ? secondsToColinHuman(~~this.getDurationSeconds()) : secondsToHuman(~~this.getDurationSeconds());
  };

  /**
   * @returns The number of channels
   * @example 2, 4, 6 || 2
  */
  public getChannels() {
    return this.metadata.data?.format.numberOfChannels || 2;
  }
}
