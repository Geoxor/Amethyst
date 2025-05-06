import type { Amethyst } from "@/amethyst";
import { useLocalStorage } from "@vueuse/core";
import type { Track } from "./track";
import { fisherYatesShuffle } from "./math";
import type { Ref } from "vue";
import { ref } from "vue";

interface TrackAnalytics {
  playCount: number;
}

const DISCOVERY_ITEMS_COUNT = 20;

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

    const genres: string[] = [];
    const genreCounts: Record<string, number> = {};

    for (const track of tracks) {
      if (!track) continue;
      if (track.getGenre() != null) {
        track.getGenre().forEach(genre => {
          if (!genres.includes(genre)) genres.push(genre);
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    }

    const total = Object.values(genreCounts).reduce((a, b) => a + b, 0);
    const genreWeights: Record<string, number> = {};
    for (const genre in genreCounts) {
      genreWeights[genre] = genreCounts[genre] / total;
    }

    const averageWeight = Object.values(genreWeights).reduce((a, b) => a + b, 0) / Object.keys(genreWeights).length;
    const genreScoreThreshold = averageWeight * 1.0;

    this.amethyst.player.queue.getList().forEach(it => {
      if (!it) return;

      const trackGenres = it.getGenre();
      if (!trackGenres) return;

      const score = trackGenres.reduce((sum, genre) => sum + (genreWeights[genre] || 0), 0);
      if (score < genreScoreThreshold) return;

      if (trackGenres.some(genre => genres.includes(genre)) &&
        !this.tracksBasedOnGenres.value.find(t => t.getAlbum() === it.getAlbum()) &&
        !this.tracksBasedOnGenres.value.includes(it) &&
        this.trackAnalytics.value[it.uuid!] == null) {
        this.tracksBasedOnGenres.value.push(it);
      }
    });


    this.amethyst.player.queue.getList().forEach(it => {
      if (it.isFavorited && !this.tracksBasedOnFavorites.value.includes(it)) this.tracksBasedOnFavorites.value.push(it);  
    });

    this.tracksBasedOnFavorites.value = this.tracksBasedOnFavorites.value.sort((a, b) => this.trackAnalytics.value[a.uuid!]?.playCount < this.trackAnalytics.value[b.uuid!]?.playCount ? 1 : -1).slice(0, DISCOVERY_ITEMS_COUNT);
    this.tracksBasedOnGenres.value = fisherYatesShuffle(this.tracksBasedOnGenres.value).slice(0, DISCOVERY_ITEMS_COUNT);
    this.tracksBasedOnRandom.value = fisherYatesShuffle(this.amethyst.player.queue.getList()).slice(0, DISCOVERY_ITEMS_COUNT);
  }

  public getPlayCount(track: Track): number {
    return this.trackAnalytics.value[track.uuid!]?.playCount ?? 0;
  }

  private incrementPlayCount(uuid: string) {
    this.lastClickedPlay[uuid] = Date.now();
    this.trackAnalytics.value[uuid].playCount++;
  }
}