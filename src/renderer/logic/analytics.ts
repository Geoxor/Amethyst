import type { Amethyst } from "@/amethyst";
import { useLocalStorage } from "@vueuse/core";
import type { Track } from "./track";
import { fisherYatesShuffle } from "./math";
import type { Ref } from "vue";
import { ref } from "vue";

interface TrackAnalytics {
  playCount: number;
}

export class Analytics {
  public trackAnalytics = useLocalStorage<Record<string, TrackAnalytics>>("trackAnalytics", {});
  public tracksBasedOnGenres: Ref<Track[]> = ref([]);
  public tracksBasedOnFavorites: Ref<Track[]> = ref([]);
  public tracksBasedOnRandom: Ref<Track[]> = ref([]);

  private emptyAnalytics = (): TrackAnalytics => ({
    playCount: 0,
  });

  private lastClickedPlay: Record<string, number> = {};

  public constructor(public amethyst: Amethyst) {
    amethyst.player.on("play", track => {
      if (!track.uuid) return;

      // Check if trackAnalytics object is defined for this song hash
      if (!this.trackAnalytics.value[track.uuid]) {
        this.trackAnalytics.value[track.uuid] = this.emptyAnalytics();
      }

      if (!this.lastClickedPlay[track.uuid]) {
        // Increment song here if it has not been played yet
        this.incrementPlayCount(track.uuid);
      }

      // Check if 3 seconds have passed since the last time they played it to avoid spam incrementing
      if (Date.now() > this.lastClickedPlay[track.uuid] + 3000) {
        this.incrementPlayCount(track.uuid);
      }
    });
  }

  // the algorith:
  // what songs are most played? take the most played!
  // then take the genres of most played
  // then give random songs of most played genres
  public getDiscoveryTracks() {

    this.tracksBasedOnGenres.value = [];
    this.tracksBasedOnFavorites.value = [];
    this.tracksBasedOnRandom.value = [];

    let tracks = Object.entries(this.trackAnalytics.value).map(
      ([uuid]) =>
        this.amethyst.player.queue.getList().find(track => track.uuid === uuid)!
    );

    // 🍌🍌🍌🍌
    tracks = tracks.sort((a, b) => this.trackAnalytics.value[a.uuid!].playCount > this.trackAnalytics.value[b.uuid!].playCount ? 1 : -1);

    for (const track of tracks) {
      this.amethyst.player.queue.getList().forEach(it => {
        if (!it || !track) return;

        if (track.getGenre() != null) {
          track.getGenre()?.forEach(genre => {
            if (it.getGenre()?.includes(genre) &&
              // make sure there is only one track per album
              !this.tracksBasedOnGenres.value.find(t => t.getAlbum() === it.getAlbum()) &&
              // make sure we don't duplicate tracks
              !this.tracksBasedOnGenres.value.includes(it) &&
              // check if the track is unplayed (unplayed tracks don't have an entry on the analytics)
              this.trackAnalytics.value[it.uuid!] == null) // <-- btw there is ")" here
              // Add the track
              this.tracksBasedOnGenres.value.push(it);
          });
        }
      });
    }

    this.amethyst.player.queue.getList().forEach(it => {
      if (it.isFavorited && !this.tracksBasedOnFavorites.value.includes(it)) this.tracksBasedOnFavorites.value.push(it);  
    });

    this.tracksBasedOnFavorites.value = fisherYatesShuffle(this.tracksBasedOnFavorites.value).slice(0, 10);
    this.tracksBasedOnGenres.value = fisherYatesShuffle(this.tracksBasedOnGenres.value).slice(0, 10);
    this.tracksBasedOnRandom.value = fisherYatesShuffle(this.amethyst.player.queue.getList()).slice(0, 10);
  }

  private incrementPlayCount(uuid: string) {
    this.lastClickedPlay[uuid] = Date.now();
    this.trackAnalytics.value[uuid].playCount++;
  }
}