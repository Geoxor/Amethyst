import { ref } from "vue";
import { useElectron } from "../amethyst";
import { bytesToHuman, secondsToColinHuman, secondsToHuman } from "@shared/formating";
import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import { IMetadata, LoadState, LoadStatus } from "@shared/types";
import FileSaver from "file-saver";
import mime from "mime-types";

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  public metadata: LoadState<IMetadata> = { state: LoadStatus.Loading, data: undefined };
  public cover: { state: LoadStatus, data: string | undefined } = { state: LoadStatus.Loading, data: undefined };
  public isLoading = ref(false);
  public isLoaded = ref(false);
  public hasErrored = ref(false);

  public constructor(public path: string) {
    if (!ALLOWED_AUDIO_EXTENSIONS.some(ext => path.toLowerCase().endsWith(ext)))
      throw new Error(`Given file extension does not match any of the allowed types [${ALLOWED_AUDIO_EXTENSIONS.join(", ")}]`);
  }

  public getCachePath() {
    return window.path.join(useElectron().APPDATA_PATH || "" , "/amethyst/Metadata Cache", this.getFilename() + ".amf");
  }
 
  private async isCached() {
    try {
      await window.fs.stat(this.getCachePath());
      return true;
    } catch (error) {
      return false;
    }
  }

  private async fetchCache() {
    return (await fetch(this.getCachePath())).json();
  }

  public getCoverByFace(face = 0) {
    const picture = this.metadata.data?.common.picture?.[face];
    if (!picture) return;
    return URL.createObjectURL(new Blob([new Uint8Array(picture.data)], { type: picture.type }));
  }

  /**
   * Fetches the metadata for a given track
   */
  public fetchMetadata = async (force = false) => {
    try {
      if (!force && await this.isCached()) {
        this.metadata.data = (await this.fetchCache()).metadata;
        this.metadata.state = LoadStatus.Loaded;
        return this.metadata.data;
      }
      const amethyst = await import("../amethyst");
      this.metadata.data = await amethyst.useElectron().getMetadata(this.path);
      this.metadata.state = LoadStatus.Loaded;
      return this.metadata.data;
    } catch (error) {
      this.hasErrored.value = true;
      console.log(error);
      return ;
    }
  };

  /**
   * Fetches the resized cover art in base64
   */
  public fetchCover = async (force = false) => {
    try {
      if (!force && await this.isCached()) {
        this.cover.data = (await this.fetchCache()).cover;
        this.cover.state = LoadStatus.Loaded;
        return this.cover.data;
      }
      const amethyst = await import("../amethyst");
      const data = await amethyst.useElectron().getCover(this.path);
      this.cover.data = data ? `data:image/webp;base64,${data}` : undefined;
      this.cover.state = LoadStatus.Loaded;
      return this.cover.data;
    } catch (error) {
      this.hasErrored.value = true;
      console.log(error);
      return;
    }
  };

  /**
   * Fetches all async data concurrently
   */
  public fetchAsyncData = async (force = false) => {
    this.isLoaded.value = false;
    this.isLoading.value = true;
    const [cover, metadata] = await Promise.all([this.fetchCover(force), this.fetchMetadata(force)]);

    if (metadata) {
      metadata.common.picture = [];
    }
    
    window.fs.writeFile(this.getCachePath(), JSON.stringify({
      cover,
      metadata,
    }, null, 2)).catch(console.log);

    this.isLoading.value = false;
    this.isLoaded.value = true;
  };

  public async exportCover(coverIdx?: number) {
    const blob = await this.getCoverAsBlob(coverIdx);
    FileSaver.saveAs(blob, `cover.${mime.extension(blob.type)}`);
  }

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

  public getCoverAsBlob = async (coverIdx = 0) => {
    const cover = (await this.fetchMetadata(true))?.common.picture?.[coverIdx];
    return cover 
      ? Promise.resolve(new Blob([new Uint8Array(cover.data)], {type: cover.format}) )
      : Promise.reject("Failed to fetch cover, possibly no cover?");
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
