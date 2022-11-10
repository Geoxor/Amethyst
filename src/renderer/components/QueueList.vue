<script setup lang="ts">
import { usePlayer, useState} from "@/amethyst";

import { ref } from "vue";
import LazyList from "@/components/LazyList.vue";
import CoverArt from "./CoverArt.vue";
const player = usePlayer();
const filterText = ref("");
const state = useState();
</script>

<template>
  <div class="flex-col p-2 flex w-full borderRight h-full ">
    <input
      v-model="filterText"
      type="text"
      class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
      placeholder="name, album & artist..."
      @keydown.stop
    >
    <!-- <empty-div v-if="player.queue.getList().size == 0" /> -->

    <cover-art
      v-if="state.settings.showAmbientBackground"
      class="absolute -top-1/4 left-0 w-full filter blur-3xl"
      :style="`opacity: ${state.settings.ambientBackgroundOpacity}%;`"
      :url="player.getCurrentTrack()?.getCover()"
    />

    <LazyList
      :headers="[
        '',
        'Filename',
        'Artist',
        'Album',
        'Container',
        'Size',
        'Duration',
      ]"
      :tracks="Array.from(player.queue.getList())
        .filter(([_, track]) => filterText ? !track.hasErrored : track)
        .filter(([_, track]) => 
          track.getFilename().toLowerCase().includes(filterText)
          || track.getArtistsFormatted().toLowerCase().includes(filterText)
          || track.getAlbumFormatted().toLowerCase().includes(filterText)
        ).map(t=>t[1])"
    />
  </div>
</template>

<style lang="postcss" scoped>
.control-hover:hover {
  @apply underline;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

td {
  @apply overflow-hidden overflow-ellipsis;
}

</style>
