import PromisePool from "@supercharge/promise-pool";
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";
import { bytesToHuman, secondsToHuman } from "@shared/formating";
import { fisherYatesShuffle } from "./math";
import { Track } from "./track";
import type { Amethyst } from "@/amethyst";

export class Queue {
  private savedQueue = useLocalStorage<string[]>("queuev2", []);
  private list = ref(new Map<string, Track>());

  public totalSize = ref(0);
  public totalDuration = ref(0);

  public constructor(private amethyst: Amethyst, paths?: string[]) {
    paths 
      ? this.add(paths)
      : this.add(this.savedQueue.value);
    
  }

  public getList() {
    return Array.from(this.list.value.values());
  }

  // public sort(by: keyof ICommonTagsResult) {
  //   return this.getList().sort((a, b) => a.metadata.data?.common[by] > b.metadata.data?.common[by] ? 1 : -1);
  // }

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
          || track.getAlbumFormatted()?.toLowerCase().includes(word));
    }

    return results;
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
    return PromisePool
			.for(force ? this.getList() : this.getList().filter(track => !track.isLoaded))
			.withConcurrency(3)
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