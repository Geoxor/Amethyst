import PromisePool from "@supercharge/promise-pool";
import { useLocalStorage } from "@vueuse/core";
import { Ref, ref } from "vue";
import { bytesToHuman, secondsToHuman } from "@shared/formating";
// import { fisherYatesShuffle } from "./math";
import { Track } from "./track";

type Order = ({
  by: keyof Track;
  order: "ascending" | "descending";
}[]) | "random";

export class Queue {
  private savedQueue = useLocalStorage<string[]>("queuev3", []);
  private fullList = ref(new Map<string, Track>());
  private _curList: Ref<Track[]> = ref([]);
  private filters = ref<((track: Track) => boolean)[]>([]);
  private sortedBy = ref<Order>([]);

  public totalSize = ref(0); // In bytes
  public totalDuration = ref(0); // In seconds

  public constructor(paths?: string[]) {
    paths 
      ? this.add(paths)
      : this.add(this.savedQueue.value);
  }

  /**
   * Get the current play queue with filters and sorting applied.
   */
  public getCurList(): Track[] {
    return this._curList.value as Track[];
  }

  /**
   * Get the full library.
   */
  public getFullList(): Track[] {
    return Array.from(this.fullList.value.values());
  }

  /**
   * @deprecated Use either {@link getFullList} for the whole library or {@link getCurList} for the current playlist.
   * Returns the whole library of tracks.
   */
  public getList() {
    return this.getFullList();
  }

  // public sort(by: keyof ICommonTagsResult) {
  //   return this.getList().sort((a, b) => a.metadata.data?.common[by] > b.metadata.data?.common[by] ? 1 : -1);
  // }

  /**
   * @deprecated use {@link filter} and {@link getCurList} for the search results.
   * Returns the list of tracks that has any word of the {@ref query} anywhere in .
   * @param query
   */
  public search(query: string) {
    const filter = this.filterFullText(query);
    return this.getList().filter(filter);
  }

  private filterFullText = (query: string) => {
    const words = query.split(" ");
    return (track: Track) => {
      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase(); 
        if (word && !track.hasErrored && !(
          track.getFilename().toLowerCase().includes(word)
          || track.getArtistsFormatted()?.toLowerCase().includes(word)
          || track.getTitle()?.toLowerCase().includes(word)
          || track.getAlbumFormatted()?.toLowerCase().includes(word)
        )) return false;
      }
      return true;
    };
  };

  public clearFilters() {
    this.filters.value = [];
    this.updateCurList();
  }

  public addFilter(query: string) {
    this.filters.value.push(this.filterFullText(query));
    this.updateCurList();
  }

  public set filter(query: string) {
    this.clearFilters();
    this.addFilter(query);
  }

  public sort(by: keyof Track, order: "ascending" | "descending") {
    if(this.sortedBy.value === "random") 
      this.sortedBy.value = [];
    this.sortedBy.value.push({ by, order });
    this.updateCurList();
  }

  public clearSort() {
    this.sortedBy.value = [];
    this.updateCurList();
  }

  private evalProperty(track: Track, property: keyof Track) {
    const value = track[property];
    if (typeof value === "function") return (value as any).call(track);
    return value;
  }

  private getComparator() {
    return (a: Track, b: Track) => {
        if (this.sortedBy.value === "random") 
          return Math.random() - 0.5;
        for (let i = 0; i < this.sortedBy.value.length; i++) {
          const { by, order } = this.sortedBy.value[i];
          const aVal = this.evalProperty(a, by);
          const bVal = this.evalProperty(b, by);
          if (aVal === bVal) continue;
          if (aVal === undefined) return order === "ascending" ? -1 : 1;
          if (bVal === undefined) return order === "ascending" ? 1 : -1;
          if (aVal > bVal) return order === "ascending" ? 1 : -1;
          if (aVal < bVal) return order === "ascending" ? -1 : 1;
        }
        return 0;
      };
  }

  private updateCurList() {
    const list = this.getFullList().filter(track => this.filters.value.every(filter => filter(track)));
    list.sort(this.getComparator());
    this._curList.value = list;
  }

  public updateTotalSize() {
    this.totalSize.value = this.getList().reduce((a, b) => a + (b.metadata.data?.size || 0), 0);
  }

  public updateTotalDuration(){
    this.totalDuration.value = this.getList().reduce((a, b) => a + (b.getDurationSeconds()), 0);
  }

  public getTotalSizeFormatted(){
    return bytesToHuman(this.totalSize.value);
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
    const { amethyst } = await import("@/amethyst");

    return PromisePool
			.for(force ? this.getList() : this.getList().filter(track => !track.isLoaded))
			.withConcurrency(amethyst.store.settings.value.processingConcurrency || 3)
			.process(async track => {
        await track.fetchAsyncData(force);
        this.updateTotalSize();
        this.updateTotalDuration();
      });
  }

  public getTrack(idx: number){
    return this.getList()[idx];
  }

  /**
   * Adds a track to the queue
   * @param path A filepath to the track
   */
  public async add(path: string | string[]) {
    if (path instanceof Array) {
      path.forEach(path => this.fullList.value.set(path, new Track(path)));
      await this.fetchAsyncData();
    } else {
      const track = new Track(path);
      this.fullList.value.set(path, track);
      await track.fetchAsyncData();
    }

    this.syncLocalStorage();
  }

  /**
   * Removes a track from the queue
   * @param target An index or Track instance to remove
   */
  public remove(target: number| Track) {
    target instanceof Track ? this.fullList.value.delete(target.path) : this.fullList.value.delete(this.getTrack(target).path);
    this.syncLocalStorage();
  }

  public clear() {
    this.fullList.value.clear();
    this.syncLocalStorage();
  }

  public clearErrored() {
    this.getList().filter(t => t.hasErrored || t.deleted).forEach(t => this.remove(t));
    this.syncLocalStorage();
  }

  /**
   * Shuffles the queue
   */
  public shuffle() {
    this.sortedBy.value = "random";
    this.updateCurList();
  }

  public shuffleToggle() {
    if (this.sortedBy.value === "random") this.clearSort();
    else this.shuffle();
  }
} 
