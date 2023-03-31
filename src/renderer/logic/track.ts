import { ref } from "vue";
import { bytesToHuman, secondsToColinHuman, secondsToHuman } from "@shared/formating";
import { IMetadata, LoadState, LoadStatus } from "@shared/types";
import FileSaver from "file-saver";
import mime from "mime-types";
import { amethyst } from "@/amethyst";

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  public metadata: LoadState<IMetadata> = { state: LoadStatus.Loading, data: undefined };
  public cover: { state: LoadStatus, data: string | undefined } = { state: LoadStatus.Loading, data: undefined };
  public isLoading = ref(false);
  public isLoaded = ref(false);
  public hasErrored = ref(false);
  public deleted: boolean = false;
  public path: string;

  public constructor(public absolutePath: string) {
    this.path = `file://${absolutePath}`;
  }

  public getCachePath(absolute?: boolean) {
    const amfPath = window.path.join(amethyst.APPDATA_PATH || "" , "/amethyst/Metadata Cache", this.getFilename() + ".amf");
    return absolute ? amfPath : `file://${amfPath}`;
  }
 
  private async isCached() {
    try {
      await window.fs.stat(this.getCachePath(true));
      return true;
    } catch (error) {
      return false;
    }
  }

  private async fetchCache() {
    return (await fetch(this.getCachePath())).json();
  }

  public async delete() {
    return window.fs.unlink(this.absolutePath).then(() => {
      this.deleted = true;
      window.fs.unlink(this.getCachePath(true)).catch();
    });
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
      this.metadata.data = await amethyst.getMetadata(this.absolutePath);
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
      const data = await amethyst.getCover(this.absolutePath);
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
    
    window.fs.writeFile(this.getCachePath(true), JSON.stringify({
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

  public async getArrayBuffer() {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return buffer;
  }

  /**
   * @returns The filename of a file from the full path
   * @example "02. Daft Punk - Get Lucky.flac"
   */
  public getFilename() {
    if (amethyst.getCurrentPlatform() === "desktop") {
      const { base } = window.path.parse(this.absolutePath);
      return base;
    }

    return this.absolutePath;
  }

  /**
   * @returns The filename of a file from the full path without its extension
   * @example "02. Daft Punk - Get Lucky"
   */
  public getFilenameWithoutExtension() {
    const { name } = window.path.parse(this.absolutePath);
    return name;
  }

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
