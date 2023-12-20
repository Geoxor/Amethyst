<script setup lang="ts">
import { amethyst, favoriteTracks } from "@/amethyst";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import SearchInput from "@/components/v2/SearchInput.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import TrackItem from "@/components/v2/TrackItem.vue";
import { LargeIconsIcon, MediumIconsIcon } from "@/icons";
import { Track } from "@/logic/track";
import { ref } from "vue";

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

</script>

<template>
  <div
    class="flex flex-col h-full w-full py-2 px-4 gap-4"
  >
    <route-header :title="$t('route.favorites')">
      <div class="flex gap-2 text-accent items-center">
        <SearchInput v-model="filterText" />
        <MediumIconsIcon />
        <slider-input
          v-model="amethyst.store.settings.value.coverGridSize"
          :min="32"
          :max="256"
          :step="1"
          class="w-32"
        />
        <LargeIconsIcon />
      </div>
    </route-header>
    <div class="flex gap-2 flex-wrap">
      <TrackItem
        v-for="track of filter(favoriteTracks.map(path => amethyst.player.queue.getTrack(amethyst.player.queue.getList().findIndex(t => t.absolutePath == path))), filterText) "
        :key="track.path"
        :track="track"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>