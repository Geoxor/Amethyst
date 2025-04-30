import { ref } from "vue";
import { bytesToHuman, secondsToColinHuman, secondsToHuman, bitrateToHuman } from "@shared/formating";
import type { IMetadata, LoadState } from "@shared/types";
import { LoadStatus } from "@shared/types";
import * as mm from "music-metadata-browser";
import FileSaver from "file-saver";
import mime from "mime-types";
import type { Amethyst } from "@/amethyst";
import { favoriteTracks } from "@/amethyst";

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
  public isFavorited: boolean = false;
  public path: string;

  public constructor(private amethyst: Amethyst, public absolutePath: string) {
    this.path = absolutePath;
    this.isFavorited = favoriteTracks.value.includes(this.path);
  }

  public toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    if (this.isFavorited) {
      favoriteTracks.value.push(this.path);
    } else {
      favoriteTracks.value.splice(favoriteTracks.value.indexOf(this.path), 1);
    }
  }

  public getCachePath(absolute?: boolean) {
    const amfPath = window.path.join(this.amethyst.APPDATA_PATH || "", "/amethyst/Metadata Cache", this.getFilename() + ".amf");
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
    return (JSON.parse(await window.fs.readFile(this.getCachePath(true), "utf-8")));
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
   * Reads track metadata from disk
   */
  private async readMetadata() {
    switch (this.amethyst.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<IMetadata>("get-metadata", [this.absolutePath]);
      case "mobile":
        const response = await fetch(decodeURIComponent(this.absolutePath));
        const buffer = new Uint8Array(await response.arrayBuffer());
        const { format, common } = await mm.parseBuffer(buffer, undefined);
        const size = buffer.length;
        return { format, common, size } as IMetadata;
      default:
        return Promise.reject();
    }
  }

  private async readCover() {
    switch (this.amethyst.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<string>("get-cover", [this.absolutePath]);
      case "mobile":
        const response = await fetch(decodeURIComponent(this.absolutePath));
        const buffer = new Uint8Array(await response.arrayBuffer());
        const { common } = await mm.parseBuffer(buffer, undefined);
        if (common.picture) {
          return common.picture[0].data.toString("base64") as string;
        }
        return;
      default:
        return Promise.reject();
    }
  }

  /**
   * Fetches the metadata for a given track
   */
  private fetchMetadata = async (force = false) => {
    try {
      if (!force && await this.isCached()) {
        this.metadata.data = (await this.fetchCache()).metadata;
        this.metadata.state = LoadStatus.Loaded;
        return this.metadata.data;
      }
      this.metadata.data = await this.readMetadata();
      this.metadata.state = LoadStatus.Loaded;
      return this.metadata.data;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  /**
   * Fetches the resized cover art in base64
   */
  private fetchCover = async (force = false) => {
    if (!force && await this.isCached()) {
      this.cover.data = (await this.fetchCache()).cover;
      this.cover.state = LoadStatus.Loaded;
      return this.cover.data;
    }
    const data = await this.readCover();
    this.cover.data = data ? `data:image/webp;base64,${data}` : undefined;
    this.cover.state = LoadStatus.Loaded;
    return this.cover.data;
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

    if (this.amethyst.getCurrentPlatform() === "desktop") {
      window.fs.writeFile(this.getCachePath(true), JSON.stringify({
        cover,
        metadata,
      }, null, 2)).catch(console.log);
    }

    this.isLoading.value = false;
    this.isLoaded.value = true;
  };

  public async getArrayBuffer() {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return buffer;
  }

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
      ? Promise.resolve(new Blob([new Uint8Array(cover.data)], { type: cover.format }))
      : Promise.reject("Failed to fetch cover, possibly no cover?");
  };

  public getTitle() {
    return this.getMetadata()?.common.title;
  }
  public getTrackNumber() {
    return this.getMetadata()?.common.track.no;
  }
  public getDiskNumber() {
    return this.getMetadata()?.common.disk.no;
  }
  public getYear() {
    return this.getMetadata()?.common.year;
  }
  public getContainer() {
    return this.getMetadata()?.format.container;
  }
  public getCodec() {
    return this.getMetadata()?.format.codec;
  }
  public getBitrate() {
    return this.getMetadata()?.format.bitrate;
  }
  public getBitsPerSample() {
    return this.getMetadata()?.format.bitsPerSample;
  }
  public getSampleRate() {
    return this.getMetadata()?.format.sampleRate;
  }
  public getFilesize() {
    return this.getMetadata()?.size;
  }
  public getArtists() {
    return this.getMetadata()?.common.artists;
  }
  public getAlbum() {
    return this.getMetadata()?.common.album;
  }
  public getDuration(){
    return this.getMetadata()?.format.duration;
  }

  /**
     * @returns The seconds of the track in float
     * @example 15.02400204024 || 0
     */
  public getDurationSeconds() {
    return this.getDuration() || 0;
  };
  /**
   * @returns The number of channels
   * @example 2, 4, 6 || 2
  */
  public getChannels() {
    return this.metadata.data?.format.numberOfChannels || 2;
  }

  /**
   * @returns The filename of a file from the full path
   * @example "02. Daft Punk - Get Lucky.flac"
   */
  public getFilename() {
    switch (this.amethyst.getCurrentPlatform()) {
      case "desktop":
        const { base } = window.path.parse(this.absolutePath);
        return base;
      case "mobile":
        return decodeURIComponent(this.absolutePath.substring(this.absolutePath.lastIndexOf("/Music/") + "/Music/".length));
      default:
        return this.absolutePath;
    }
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
  public getFilesizeFormatted() {
    return bytesToHuman(this.getFilesize() || 0);
  }

  public getBitrateFormatted() {
    return bitrateToHuman(this.getBitrate() || 0);
  }

  /**
   * @returns The title from metadata and falls back to the filename
   * @example "Get Lucky" || "02. Daft Punk - Get Lucky.flac"
   */
  public getTitleFormatted() {
    return this.getTitle() || this.getFilename();
  };

  /**
   * @returns The artist(s) (joined with a "&") from metadata and falls back to "uknown artist"
   * @example "Daft Punk", "Virtual Riot & Panda Eyes",
   */
  public getArtistsFormatted() {
    return this.getArtists()?.join(" & ");
  };

  /**
   * @returns The seconds of the track in a human readable format
   * @example "0:15", "1:54"
   */
  public getDurationFormatted(colinNotation?: boolean) {
    return colinNotation ? secondsToColinHuman(~~this.getDurationSeconds()) : secondsToHuman(~~this.getDurationSeconds());
  };

}
