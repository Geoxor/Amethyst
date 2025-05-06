import type { Amethyst } from "@/amethyst";
import { useLocalStorage } from "@vueuse/core";
import type { Track } from "./track";
import { fisherYatesShuffle } from "./math";
import type { Ref} from "vue";
import { ref } from "vue";

interface TrackAnalytics {
  playCount: number;
}

export class Analytics {
  public trackAnalytics = useLocalStorage<Record<string, TrackAnalytics>>("trackAnalytics", {});
  public discoveryTracks: Ref<Track[]> = ref([]);

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

    this.discoveryTracks.value = [];

    let tracks = Object.entries(this.trackAnalytics.value).map(
      ([uuid]) => 
        this.amethyst.player.queue.getList().find(track => track.uuid === uuid)!
    );

    // 🍌🍌🍌🍌
    tracks = tracks.sort((a, b) => this.trackAnalytics.value[a.uuid!].playCount > this.trackAnalytics.value[b.uuid!].playCount ? 1 : -1);
    tracks = tracks.slice(0, tracks.length / 2);

    for (const track of tracks) {
         this.amethyst.player.queue.getList().forEach(it => {
          if (!it) return;
          if (track.getGenre() != null) {
            track.getGenre()?.forEach(genre => {
              if (it.getGenre()?.includes(genre) && 
                  !this.discoveryTracks.value.find(t => t.getAlbum() === it.getAlbum()) && 
                  !this.discoveryTracks.value.includes(it) && this.trackAnalytics.value[it.uuid!] == null) 
                  this.discoveryTracks.value.push(it);
            });
          }
        })!;
    }

    this.discoveryTracks.value = fisherYatesShuffle(this.discoveryTracks.value);
    this.discoveryTracks.value = this.discoveryTracks.value.slice(0, 10);
    this.discoveryTracks.value.reverse();
  }

  private incrementPlayCount(uuid: string) {
    this.lastClickedPlay[uuid] = Date.now();
    this.trackAnalytics.value[uuid].playCount++;
  }
}