import { useLocalStorage } from "@vueuse/core";
import type { Ref } from "vue";
import { ref } from "vue";

import type { Amethyst } from "@/amethyst.js";
import { fisherYatesShuffle } from "@/logic/math.js";
import type { Track } from "@/logic/track.js";

interface TrackAnalytics {
  playCount: number;
}

const DISCOVERY_ITEMS_COUNT = 20;

export class Analytics {
  public trackAnalytics = useLocalStorage<Record<string, TrackAnalytics>>("trackAnalytics", {});
  public tracksBasedOnGenres: Ref<Set<Track>> = ref(new Set([]));
  public tracksBasedOnFavorites: Ref<Set<Track>> = ref(new Set([]));
  public tracksBasedOnRandom: Ref<Set<Track>> = ref(new Set([]));

  private emptyAnalytics = (): TrackAnalytics => ({
    playCount: 0,
  });

  private lastClickedPlay: Record<string, number> = {};

  public constructor(public amethyst: Amethyst) {
    amethyst.player.on("player:trackChange", (track) => {
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
    const allLoadedTracks = this.amethyst.player.queue.getList();
    const trackMap = new Map(allLoadedTracks.map((track) => [track.uuid, track]));
    let tracks = Object.keys(this.trackAnalytics.value).map((uuid) => trackMap.get(uuid)!);

    this.tracksBasedOnGenres.value.clear();
    this.tracksBasedOnFavorites.value.clear();
    this.tracksBasedOnRandom.value.clear();

    // 🍌🍌🍌🍌
    tracks = tracks.sort((a, b) => this.trackAnalytics.value[a.uuid!].playCount > this.trackAnalytics.value[b.uuid!].playCount ? 1 : -1);

    const genres: string[] = [];
    const genreCounts: Record<string, number> = {};

    for (const track of tracks) {
      if (!track) continue;
      if (track.getGenre() != null) {
        track.getGenre()!.forEach((genre) => {
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

    const genreSet = new Set(genres);
    const existingAlbums = new Set(
      Array.from(this.tracksBasedOnGenres.value.values()).map((t) => t.getAlbum()),
    );
    const analyticsMap = this.trackAnalytics.value;

    for (const it of allLoadedTracks) {
      if (!it) continue;

      if (it.isFavorited) {
        this.tracksBasedOnFavorites.value.add(it);
      }

      const trackGenres = it.getGenre();
      if (!trackGenres) continue;

      const score = trackGenres.reduce(
        (sum, genre) => sum + (genreWeights[genre] || 0),
        0,
      );
      if (score < genreScoreThreshold) continue;

      // Genre match + album not already added + no analytics
      const hasMatchingGenre = trackGenres.some((g) => genreSet.has(g));
      const album = it.getAlbum();
      const isAlreadyAdded = existingAlbums.has(album);
      const isInAnalytics = analyticsMap[it.uuid!] != null;

      if (hasMatchingGenre && !isAlreadyAdded && !isInAnalytics) {
        this.tracksBasedOnGenres.value.add(it);
        existingAlbums.add(album); // keep album cache updated
      }
    }

    this.tracksBasedOnFavorites.value = new Set([...this.tracksBasedOnFavorites.value.values()].sort((a, b) => this.trackAnalytics.value[a.uuid!]?.playCount < this.trackAnalytics.value[b.uuid!]?.playCount ? 1 : -1).slice(0, DISCOVERY_ITEMS_COUNT));
    this.tracksBasedOnGenres.value = new Set (fisherYatesShuffle([...this.tracksBasedOnGenres.value.values()]).slice(0, DISCOVERY_ITEMS_COUNT));
    this.tracksBasedOnRandom.value = new Set (fisherYatesShuffle(allLoadedTracks).slice(0, DISCOVERY_ITEMS_COUNT));
  }

  public getPlayCount(track: Track): number {
    return this.trackAnalytics.value[track.uuid!]?.playCount ?? 0;
  }

  private incrementPlayCount(uuid: string) {
    this.lastClickedPlay[uuid] = Date.now();
    this.trackAnalytics.value[uuid].playCount++;
  }
}
