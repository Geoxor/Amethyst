import { bitrateToHuman, bytesToHuman, secondsToColinHuman, secondsToHuman } from "@shared/formating.js";
import type { IMetadata, LoadState } from "@shared/types.js";
import { LoadStatus } from "@shared/types.js";
import FileSaver from "file-saver";
import { md5 } from "js-md5";
import mime from "mime-types";
import * as mm from "music-metadata";
import { MusicBrainzApi } from "musicbrainz-api";
import { ref } from "vue";

import type { Amethyst } from "@/amethyst.js";
import { amethyst, favoriteTracks } from "@/amethyst.js";
import { useInspector } from "@/components/Inspector/index.js";
import { saveArrayBufferToFile } from "@/logic/dom.js";
import { convertDfpwm } from "@/logic/encoding.js";

import { MediaSourceType } from "./MediaSource/index.js";

const mbApi = new MusicBrainzApi({
  appName: "Amethyst",
  appVersion: "2.0.7",
  appContactInfo: "todo@example.com",
});

export const trackContextMenuOptions = (track: Track) => ([
  { title: "track.context_menu.play", icon: "ic:round-play-arrow", action: () => amethyst.player.play(track) },
  { title: "track.context_menu.inspect", icon: "mdi:flask", action: () => useInspector().inspectAndShow(track) },
  track.isFavorited
    ? { title: "track.context_menu.unfavorite", icon: "ic:twotone-favorite-border", action: () => track.toggleFavorite() }
    : { title: "track.context_menu.favorite", icon: "ic:twotone-favorite", action: () => track.toggleFavorite() },
  { title: "track.context_menu.encode_to_.dfpwm", icon: "ic:twotone-qr-code", action: async () => {
    saveArrayBufferToFile(
      await convertDfpwm(await track.getArrayBuffer()),
      {
        filename: track.getFilenameWithoutExtension(),
        extension: "dfpwm",
      });
  } },
  { title: "track.context_menu.show_in_explorer", icon: "ic:twotone-pageview", action: () => amethyst.showItem(track.path) },
  { title: "track.context_menu.export_cover", icon: "ic:twotone-add-photo-alternate", action: () => track.exportCover() },
  { title: "track.context_menu.reload_metadata", icon: "mdi:flask", action: () => track.fetchAsyncData(true) },
  { title: "track.context_menu.remove_from_queue", icon: "ic:twotone-delete", red: true, action: () => amethyst.player.queue.remove(track) },
  { title: "track.context_menu.delete_from_disk", icon: "ic:twotone-delete-forever", red: true, action: () => track.delete() },
]);

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  public metadata: LoadState<IMetadata> = { state: LoadStatus.Loading, data: undefined };
  public cover: { state: LoadStatus; data: string | undefined } = { state: LoadStatus.Loading, data: undefined };
  public isLoading = ref(false);
  public isLoaded = ref(false);
  public hasErrored = ref(false);
  public deleted: boolean = false;
  public isFavorited: boolean = false;
  public path: string;
  public uuid: string | undefined;

  public sourceType: MediaSourceType = MediaSourceType.Local;

  // new stuff for refactoring
  public coverUrl: string = "";
  public subsonicTrackId?: string = "";
  public credentials?: { username: string; password: string; url: string };
  public title: string = "";
  public duration: number = 0;
  public album: string = "";
  public artists: string[] | undefined = undefined;
  public size: number = 0;
  public bitRate: number = 0;
  public discNumber: number = 0;
  public trackNumber: number = 0;
  public year: number = 0;

  public constructor(private amethyst: Amethyst, public absolutePath: string) {
    this.path = absolutePath;
    this.generateHash();
  }

  private generateHash() {
    this.uuid = md5(this.sourceType == MediaSourceType.Local ? `${this.getArtistsFormatted()}, ${this.getAlbum()}, ${this.getTitle()}, ${this.getFilename()}` : this.path);
    this.isFavorited = favoriteTracks.value.includes(this.uuid);
  }

  public toggleFavorite() {
    if (!this.isLoaded) return;

    this.isFavorited = !this.isFavorited;

    if (this.sourceType == MediaSourceType.Subsonic) {
      let url = "";
      if (this.isFavorited) {
        url = `${this.credentials!.url}/rest/star?id=${this.subsonicTrackId}&u=${this.credentials!.username}&p=${this.credentials!.password}&v=1.16.1&c=Amethyst`;
      }
      else {
        url = `${this.credentials!.url}/rest/unstar?id=${this.subsonicTrackId}&u=${this.credentials!.username}&p=${this.credentials!.password}&v=1.16.1&c=Amethyst`;
      }
      fetch(url).catch((error) => {
        console.error("Failed to toggle favorite status on Subsonic server:", error);
      });
    };

    console.log(this.uuid);
    if (this.isFavorited) {
      favoriteTracks.value.push(this.uuid!);
    }
    else {
      favoriteTracks.value.splice(favoriteTracks.value.indexOf(this.uuid!), 1);
    }
  }

  public getCachePath(absolute?: boolean) {
    const amfPath = window.path.join(this.amethyst.APPDATA_PATH || "", "/amethyst/Metadata Cache", (this.sourceType == MediaSourceType.Subsonic ? this.subsonicTrackId! : this.getFilename()) + ".amf");
    return absolute ? amfPath : `file://${amfPath}`;
  }

  private async isCached() {
    try {
      await window.fs.stat(this.getCachePath(true));
      return true;
    }
    catch (error) {
      return false;
    }
  }

  private async fetchCache() {
    const data = await window.fs.readFile(this.getCachePath(true), "utf8");
    try {
      return await JSON.parse(data.trim());
    }
    catch (error) {
      if (error instanceof SyntaxError) {
        console.log("Fixing malformed metadata cache file due to interruption during I/O operation");
        await this.fetchAsyncData(true);
        return null;
      }
    }
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
    if (this.sourceType == MediaSourceType.Subsonic) return;

    switch (this.amethyst.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<IMetadata>("get-metadata", [this.absolutePath]);
      case "mobile":
        const response = await fetch(this.absolutePath);
        const buffer = new Uint8Array(await response.arrayBuffer());
        const { format, common } = await mm.parseBuffer(buffer, undefined);
        const size = buffer.length;
        return { format, common, size } as IMetadata;
      default:
        return Promise.reject();
    }
  }

  private async readCover() {
    if (this.sourceType == MediaSourceType.Subsonic) return;

    switch (this.amethyst.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<string>("get-cover", [this.absolutePath]);
      case "mobile":

        function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
          let binary = "";
          const bytes = new Uint8Array(buffer);
          const len = bytes.length;

          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          return btoa(binary);
        }

        const response = await fetch(this.absolutePath);
        const buffer = new Uint8Array(await response.arrayBuffer());
        const { common } = await mm.parseBuffer(buffer, undefined);
        if (common.picture) {
          return arrayBufferToBase64(common.picture[0].data);
        }
        return;
      default:
        return Promise.reject();
    }
  }

  /**
   * Fetches the metadata for a given track
   */
  private fetchMetadata = async (force = false, metadata: IMetadata | undefined) => {
    try {
      if (!force) {
        this.metadata.data = metadata;
        this.metadata.state = LoadStatus.Loaded;
        this.generateHash();
        return this.metadata.data;
      }
      this.metadata.data = await this.readMetadata();
      this.metadata.state = LoadStatus.Loaded;
      this.generateHash();
      return this.metadata.data;
    }
    catch (error) {
      console.log(error, this.absolutePath);
      return;
    }
  };

  /**
   * Fetches the resized cover art in base64
   */
  private fetchCover = async (force = false, cover: string) => {
    if (!force) {
      this.cover.data = cover;
      this.cover.state = LoadStatus.Loaded;
      return this.cover.data;
    }
    const data = await this.readCover();
    this.cover.data = data ? `data:image/webp;base64,${data}` : undefined;
    this.cover.state = LoadStatus.Loaded;
    return this.cover.data;
  };

  public fetchAlbumCoverUrl = async () => {
    if (this.coverUrl !== "") {
      return;
    }

    let muid = this.metadata.data?.common.musicbrainz_albumid ?? "";

    if (!muid) {
      let artist = this.metadata.data?.common.artist ?? "";
      let album = this.metadata.data?.common.album ?? this.metadata.data?.common.title ?? "";

      // If missing artist or album, try parsing filename
      if (!artist || !album) {
        const fileWithExt = this.absolutePath?.split(/[/\\]/).pop() ?? "";
        const fname = fileWithExt.replace(/\.[^/.]+$/, "");

        if (fname.includes(" - ")) {
          const [left, right] = fname.split(" - ");
          artist ||= left.trim();
          album ||= right.trim();
        }
        else {
          album ||= fname;
        }
      }

      let queryString = `release:${album}`;
      if (artist)
        queryString = `artist:${artist} AND ${queryString}`;

      const result = await mbApi.search("release", {
        query: queryString,
      });

      if (!result.count) return;

      const [topResult] = result.releases;
      muid = topResult.id;
    }

    try {
      const response = await fetch(`https://coverartarchive.org/release/${muid}/front-500`);
      if (response.ok) this.coverUrl = response.url;
    }
    catch {}
  };

  /**
   * Fetches all async data concurrently
   */
  public fetchAsyncData = async (force = false) => {
    this.isLoaded.value = false;
    this.isLoading.value = true;

    const isCached = await this.isCached();
    force = !isCached ? true : force;

    let cachedData: any = {};
    if (!force) {
      cachedData = await this.fetchCache();
    }

    // Generate analytics entry if it doesn't exist (reverse compatability with old versions)
    const analytics = this.uuid ? this.amethyst.analytics.trackAnalytics.value[this.uuid] : undefined;
    if (analytics && this.uuid) {
      this.amethyst.analytics.trackAnalytics.value[this.uuid] = {
        playCount: analytics.playCount || 0,
        skipCount: analytics.skipCount || 0,
        dateAdded: analytics.dateAdded || Date.now(),
      };
    }

    if (this.sourceType != MediaSourceType.Subsonic) {
      const [cover, metadata] = await Promise.all([this.fetchCover(force, cachedData.cover), this.fetchMetadata(force, cachedData.metadata)]);

      if (metadata) {
        metadata.common.picture = [];
      }

      if (force && this.amethyst.getCurrentPlatform() == "desktop") {
        window.fs.writeFile(this.getCachePath(true), JSON.stringify({
          cover,
          metadata,
          sourceType: this.sourceType,
          coverUrl: this.coverUrl,
          title: this.title,
          duration: this.duration,
          album: this.album,
          artists: this.artists,
          size: this.size,
          bitRate: this.bitRate,
        }, null, 2)).catch((error) => {
          console.error("Failed to write metadata cache file, did you delete the 'Metadata Cache' folder?", error);
        });
      }
    };

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
    if (this.coverUrl !== "") return this.coverUrl;
    if (this.cover.state != LoadStatus.Loaded) return;
    return this.cover.data;
  };

  public getCoverAsBlob = async (coverIdx = 0) => {
    const cover = (await this.fetchMetadata(true, undefined))?.common.picture?.[coverIdx];
    return cover
      ? Promise.resolve(new Blob([new Uint8Array(cover.data)], { type: cover.format }))
      : Promise.reject("Failed to fetch cover, possibly no cover?");
  };

  public getTitle() {
    return this.title || this.getMetadata()?.common.title;
  }

  public setTitle(t: string) {
    this.title = t;
  };

  public setAlbum(t: string) {
    this.album = t;
  };

  public setArtists(t: string[]) {
    this.artists = t;
  };

  public setDuration(t: number) {
    this.duration = t;
  };

  public setCoverArt(t: string) {
    this.coverUrl = t;
  }

  public setSize(t: number) {
    this.size = t;
  }

  public setBitRate(t: number) {
    this.bitRate = t;
  }

  public setDiscNumber(t: number) {
    this.discNumber = t;
  }

  public setTrackNumber(t: number) {
    this.trackNumber = t;
  }

  public setYear(t: number) {
    this.year = t;
  }

  public setIsFavorite(t: boolean) {
    this.isFavorited = t;
  }

  public getTrackNumber() {
    return this.trackNumber || this.getMetadata()?.common.track.no;
  }

  public getBarcode() {
    return this.getMetadata()?.common.barcode;
  }

  public getLabel() {
    return this.getMetadata()?.common.label;
  }

  public getISRC() {
    return this.getMetadata()?.common.isrc;
  }

  public getCopyright() {
    return this.getMetadata()?.common.copyright;
  }

  public getGenre() {
    return this.getMetadata()?.common.genre?.sort();
  }

  public getGenreFormatted() {
    return this.getGenre()?.join(", ");
  }

  public getBPM() {
    return this.getMetadata()?.common.bpm;
  }

  public getDiskNumber() {
    return this.discNumber || this.getMetadata()?.common.disk.no;
  }

  public getYear() {
    return this.year || this.getMetadata()?.common.year;
  }

  public getContainer() {
    return this.getMetadata()?.format.container;
  }

  public getCodec() {
    return this.getMetadata()?.format.codec;
  }

  public getBitrate() {
    return this.bitRate || this.getMetadata()?.format.bitrate;
  }

  public getBitsPerSample() {
    return this.getMetadata()?.format.bitsPerSample;
  }

  public getBitsPerSampleFormatted() {
    return this.getBitsPerSample() ? `${this.getBitsPerSample()} bit` : undefined;
  }

  public getSampleRate() {
    return this.getMetadata()?.format.sampleRate;
  }

  public getSampleRateFormatted() {
    return this.getSampleRate() ? `${this.getSampleRate()} Hz` : undefined;
  }

  public getFilesize() {
    return this.size || this.getMetadata()?.size;
  }

  public getArtists() {
    return this.artists || this.getMetadata()?.common.artists;
  }

  public getAlbum() {
    return this.album || this.getMetadata()?.common.album;
  }

  public getDuration() {
    return this.duration || this.getMetadata()?.format.duration;
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
   * @returns The artist(s) (joined with a "&") from metadata
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
