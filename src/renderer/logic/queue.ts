import { secondsToHuman } from "@shared/formating.js";
import {PromisePool} from "@supercharge/promise-pool";
import { useLocalStorage } from "@vueuse/core";
import type { Ref } from "vue";
import { ref } from "vue";

import type { Amethyst } from "@/amethyst.js";
import { fisherYatesShuffle } from "@/logic/math.js";
import { Track } from "@/logic/track.js";

const COMPARATORS_BY_METHOD = {
  "default": () => 0,
  "trackNumber": (a, b) => {
    const diskNumberDiff = (a.getDiskNumber() ?? 1) - (b.getDiskNumber() ?? 1);
    if (diskNumberDiff !== 0) return diskNumberDiff;
    return (a.getTrackNumber() ?? 1) - (b.getTrackNumber() ?? 1);
  },
  "diskNumber": (a, b) => (a.getDiskNumber() ?? 1) > (b.getDiskNumber() ?? 1) ? 1 : -1,
  "filename": (a, b) => (a.getFilename()) > (b.getFilename()) ? 1 : -1,
  "title": (a, b) => (a.getTitle() || "") > (b.getTitle() || "") ? 1 : -1,
  "artist": (a, b) => (a.getArtistsFormatted() || "") > (b.getArtistsFormatted() || "") ? 1 : -1,
  "album": (a, b) => (a.getAlbum() || "") > (b.getAlbum() || "") ? 1 : -1,
  "year": (a, b) => (a.getYear() || 0) > (b.getYear() || 0) ? 1 : -1,
  "duration": (a, b) => (a.getDurationSeconds()) > (b.getDurationSeconds()) ? 1 : -1,
  "container": (a, b) => (a.getContainer() || "") > (b.getContainer() || "") ? 1 : -1,
  "sampleRate": (a, b) => (a.getSampleRate() || 0) > (b.getSampleRate() || 0) ? 1 : -1,
  "favorite": (a, b) => (a.isFavorited) > (b.isFavorited) ? 1 : -1,
  "bitsPerSample": (a, b) => (a.getBitsPerSample() || 0) > (b.getBitsPerSample() || 0) ? 1 : -1,
  "bitrate": (a, b) => (a.getBitrate() || 0) > (b.getBitrate() || 0) ? 1 : -1,
  "size": (a, b) => (a.getFilesize() || 0) > (b.getFilesize() || 0) ? 1 : -1,
  "barcode": (a, b) => (a.getBarcode() || "") > (b.getBarcode() || "") ? 1 : -1,
  "label": (a, b) => (a.getLabel() || "") > (b.getLabel() || "") ? 1 : -1,
  "isrc": (a, b) => (a.getISRC()?.[0] || "") > (b.getISRC()?.[0] || "") ? 1 : -1,
  "copyright": (a, b) => (a.getCopyright() || "") > (b.getCopyright() || "") ? 1 : -1,
  "genre": (a, b) => (a.getGenreFormatted() || "") > (b.getGenreFormatted() || "") ? 1 : -1,
  "bpm": (a, b) => (a.getBPM() || 0) > (b.getBPM() || 0) ? 1 : -1,
} satisfies Record<string, (a: Track, b: Track) => number> ;

export type PossibleSortingMethods = keyof typeof COMPARATORS_BY_METHOD;

export class Queue {
  private savedQueue = useLocalStorage<string[]>("queuev2", []);
  private list: Ref<Map<string, Track>> = ref(new Map());

  public totalSize = ref(0);
  public totalDuration = ref(0);

  public currentSortingDirection: Ref<"ascending" | "descending"> = ref("ascending");

  public constructor(private amethyst: Amethyst, paths?: string[]) {
    paths 
      ? this.add(paths)
      : this.add(this.savedQueue.value);
    
  }

  public getList() {
    return [...this.list.value.values()];
  }

  public search(search: string) {
    const words = search.split(" ");
    let results = this.getList();

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      results = results
        .filter(track => word ? !track.hasErrored : track)
        .filter(track => 
          track.getFilename().toLowerCase().includes(word)
          || track.getArtistsFormatted()?.toLowerCase().includes(word)
          || track.getTitle()?.toLowerCase().includes(word)
          || track.getGenreFormatted()?.toLowerCase().includes(word)
          || track.getAlbum()?.toLowerCase().includes(word));
    }

    return results;
  }

  public searchTracks(search: string, tracks: Track[]) {
    const words = search.split(" ");
    let results = tracks;

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      results = results
        .filter(track => word ? !track.hasErrored : track)
        .filter(track => 
          track.getFilename().toLowerCase().includes(word)
          || track.getArtistsFormatted()?.toLowerCase().includes(word)
          || track.getTitle()?.toLowerCase().includes(word)
          || track.getGenreFormatted()?.toLowerCase().includes(word)
          || track.getAlbum()?.toLowerCase().includes(word));
    }

    return results;
  }

  public getListSorted(sortBy: PossibleSortingMethods, search?: string) {
    const sorted = [...(search ? this.search(search) : this.getList())];
    sorted.sort(COMPARATORS_BY_METHOD[sortBy]);
    if (this.currentSortingDirection.value === "descending") {
      sorted.reverse();
    }
    return sorted;
  }

  public getTotalTracks(){
    return this.getList().length;
  }

  public getTotalDurationFormatted() {
    return secondsToHuman(this.totalDuration.value);
  }

  /**
   * Saves the current queue to local storage for persistance
   */
  private syncLocalStorage() {
    this.savedQueue.value = this.getList().map(t => t.absolutePath);
  }

  /**
   * Fetches all async data for each track concurrently
   */
  public async fetchAsyncData(force?: boolean){
    const tracks = force ? this.getList() : this.getList().filter(track => !track.isLoaded);
    const pool = await PromisePool
			.for(tracks)
			.withConcurrency(this.amethyst.state.settings.performance.processingConcurrency)
			.process(async track => {
        await track.fetchAsyncData(force);
      });

    return pool;
  }

  public getTrack(idx: number) {
    return this.getList()[idx];
  }

  /**
   * Adds a track to the queue
   * @param item A filepath to the track
   */
  public async add(item: (string | string[]) | Track) {
    if (item instanceof Track) {
      this.list.value.set(item.path, item);
    } else if (item instanceof Array) {
      const paths = Array.from(item);
      paths.forEach(path => this.list.value.set(path, new Track(this.amethyst, path)));
    } else if (typeof item === "string") {
      this.list.value.set(item, new Track(this.amethyst, item));
    } else {
      throw new Error("Tried to create a track with an invalid path type");
    }
    
    this.syncLocalStorage();
  }

  /**
   * Removes a track from the queue
   * @param target An index or Track instance to remove
   */
  public remove(target: number| Track) {
    target instanceof Track ? this.list.value.delete(target.path) : this.list.value.delete(this.getTrack(target).path);
    this.syncLocalStorage();
  }

  public clear(){
    this.list.value.clear();
    this.syncLocalStorage();
  }

  public clearErrored(){
    this.getList().filter(t => t.hasErrored || t.deleted).forEach(t => this.remove(t));
    this.syncLocalStorage();
  }

  /**
   * Shuffles the queue
   */
  public shuffle() {
		this.list.value = new Map(fisherYatesShuffle(Array.from(this.list.value.entries())));
    this.syncLocalStorage();
  }
} 