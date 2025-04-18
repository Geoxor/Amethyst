<script setup lang="ts">
import { amethyst, favoriteTracks } from "@/amethyst";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import SearchInput from "@/components/v2/SearchInput.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import TrackItem from "@/components/v2/TrackItem.vue";
import { Track } from "@/logic/track";
import { computed, ref } from "vue";

const favorites = computed(() => favoriteTracks.value.map(path => amethyst.player.queue.getTrack(amethyst.player.queue.getList().findIndex(t => t.absolutePath == path))));

const filterText = ref("");
const filter = (tracks: Track[], search: string) => {
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
          || track.getAlbumFormatted()?.toLowerCase().includes(word));
    }

    return results;
  };

const playFavorites = () => {
  // TODO: can't do this yet because we are loading all the tracks to the queue currently
  // TODO: track instances have to be within a library manager class or something similar
  // TODO: that way the queue is independant of the entire library so we can clear it and queue up
  // TODO: favourites without them disappearing when clearing the queue  
  // amethyst.player.queue.clear();
  favorites.value.forEach(amethyst.player.queue.add);
  amethyst.player.play(0);
};

</script>

<template>
  <div
    class="flex flex-col h-full w-full py-2 px-4 gap-4 overflow-y-auto"
  >
    <route-header :title="$t('route.favorites')">
      <div class="flex gap-2 text-text_subtitle items-center">
        <button-input
          text="Play all"
          :icon="'ic:round-play-arrow'"
          @click="playFavorites"
        />
        <search-input v-model="filterText" />
        <MediumIconsIcon />
        <slider-input
          v-model="amethyst.store.settings.value.coverGridSize"
          :min="32"
          :max="256"
          :step="8"
          class="w-32"
        />
        <LargeIconsIcon />
      </div>
    </route-header>
    <div class="flex gap-2 flex-wrap">
      <track-item
        v-for="track of filter(favorites, filterText) "
        :key="track.path"
        :track="track"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>