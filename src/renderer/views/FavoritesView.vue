<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { computed, onMounted, onUnmounted } from "vue";

import { amethyst } from "@/amethyst.js";
import TrackCard from "@/components/TrackCard.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import SearchInput from "@/components/v2/SearchInput.vue";
onMounted(() => {
  amethyst.analytics.getDiscoveryTracks();
});

const filterText = useLocalStorage("filterTextFavorites", "");
const clearFilterText = () => filterText.value = "";

onMounted(() => {
  amethyst.state.on("view:refresh", clearFilterText);
});
onUnmounted(() => {
  amethyst.state.off("view:refresh", clearFilterText);
});
</script>

<template>
  <div class="flex flex-col gap-2 w-full py-2 pl-4 pr-2 text-text-title">
    <route-header :title="$t('route.favorites')">
      <search-input v-model="filterText" />
    </route-header>

    <header
      v-if="amethyst.player.getFavorites().length == 0"
      class=" opacity-50 text-primary-1000"
    >
      {{ $t('favorites.no_favorites') }}
    </header>

    <div
      v-else
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 overflow-y-auto p-2 pb-32"
    >
      <track-card
        v-for="track of amethyst.player.queue.searchTracks(filterText, amethyst.player.getFavorites())"
        :key="track.path"
        class="w-full"
        :track="track"
      />
    </div>
  </div>
</template>
