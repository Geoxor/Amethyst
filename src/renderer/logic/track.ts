import type { IAudioMetadata } from "music-metadata";
import { secondsToHuman } from "./formating";
import {ref} from "vue";

export type LoadState<T> = {
  state: "loading",
  data: undefined
} | {
  state: "loaded",
  data: T
};

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  public metadata: LoadState<IAudioMetadata> = { state: "loading", data: undefined };
  public cover: {state: "loading" | "loaded", data: string | undefined} = { state: "loading", data: undefined };
  public isLoading = ref(false);
  public isLoaded = ref(false);

  public constructor(public path: string) { /* {...} */ }

  /**
   * Fetches the metadata for a given track
   * @param path The track file path
   */
  public fetchMetadata = async () => {
    const amethyst = await import("../amethyst");
    this.metadata.data = await amethyst.useElectron().getMetadata(this.path);
    this.metadata.state = "loaded";
  };

  public fetchCover = async () => { 
    const amethyst = await import("../amethyst"); 
    const data = await amethyst.useElectron().getCover(this.path);
    this.cover.data = data ? `data:image/webp;base64,${data}` : undefined;
    this.cover.state = "loaded";
  };

  public fetchAsyncData = async () => {
    this.isLoading.value = true;
    // TODO: make the covers be fetch with the metadata so we dont fetch the metadata twice
    await Promise.all([this.fetchCover(), this.fetchMetadata()]); 
    this.isLoaded.value = true;
    this.isLoading.value = false;
  };

  /**
   * @returns The metadata object for this tune if it's loaded
   * @throws Error message if the object hasn't loaded yet
   */
  public getMetadata = () => {
    if (this.metadata.state != "loaded") throw new Error("Metadata hasn't finished loading yet for this file");
    return this.metadata.data;
  };

   public getCover = () => {
    if (this.cover.state != "loaded") throw new Error("Cover hasn't finished loading yet for this file");
    return this.cover.data;
  };

  /**
   * @returns The filename of a file from the full path
   * @example "02. Daft Punk - Get Lucky.flac"
   */
	public getFilename = () => {
		return this.path.substring(Math.max(this.path.lastIndexOf("\\"), this.path.lastIndexOf("/")) + 1);
	};

  /**
   * @returns The title from metadata and falls back to the filename
   * @example "Get Lucky" || "02. Daft Punk - Get Lucky.flac"
   */
	public getTitleFormatted = () => {
		return this.getMetadata()?.common.title || this.getFilename();
	};

  /**
   * @returns The artist(s) (joined with a "&") from metadata and falls back to "uknown artist"
   * @example "Daft Punk", "Virtual Riot & Panda Eyes" || "unknown artist",
   */
	public getArtistsFormatted = () => {
		return this.getMetadata()?.common.artists?.join(" & ") || "unknown artist";
	};

  /**
   * @returns The seconds of the track in float
   * @example 15.02400204024 || 0
   */
  public getDurationSeconds = () => {
    return this.getMetadata()?.format.duration || 0;
  };

  /**
   * @returns The seconds of the track in a human readable format
   * @example "0:15", "1:54"
   */
  public getDurationFormatted = () => {
    return secondsToHuman(this.getDurationSeconds());
  };

}
