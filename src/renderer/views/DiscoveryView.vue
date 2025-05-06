<script setup lang="ts">
import { amethyst } from "@/amethyst";
import DiscoveryFeed from "@/components/DiscoveryFeed.vue";
import SettingsCategory from "@/components/settings/SettingsCategory.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import { onUnmounted } from "vue";

onUnmounted(() => {
  amethyst.analytics.getDiscoveryTracks();
});

</script>

<template>
  <div class="flex flex-col h-full w-full py-2 px-4 gap-4 text-text_title">
    <route-header :title="$t('route.discovery')" />
    <div class="flex gap-2 mt-1">
      <settings-category
        class="flex gap-2 w-full"
        :icon="'ic:twotone-control-point-duplicate'" 
        title="just send it"
        description="i cant decide"
        @click="amethyst.player.playRandomTrack()"
      />
      <settings-category
        class="flex gap-2 w-full"
        :icon="'ic:twotone-favorite'" 
        title="favorites"
        description="view your favorite saved songs"
      />
      <settings-category
        class="flex gap-2 w-1/2"
        :icon="'ic:twotone-list'" 
        title="just send it"
        description="i cant decide"
      />
      <settings-category
        class="flex gap-2"
        :icon="'ic:twotone-plus'" 
        title="just send it"
        description="i cant decide"
      />
    </div>
    <div class="flex flex-col overflow-y-auto pb-32 h-full">
      <discovery-feed
        :title="$t('discovery.for_you.title')"
        :subtitle="$t('discovery.for_you.description')"
        :tracks="amethyst.analytics.tracksBasedOnGenres.value"
      />
      <discovery-feed
        :title="$t('discovery.favorites.title')"
        :subtitle="$t('discovery.favorites.description')"
        :tracks="amethyst.analytics.tracksBasedOnFavorites.value"
      />
      <discovery-feed
        :title="$t('discovery.random.title')"
        :subtitle="$t('discovery.random.description')"
        :tracks="amethyst.analytics.tracksBasedOnRandom.value"
      />
    </div>
  </div>
</template>