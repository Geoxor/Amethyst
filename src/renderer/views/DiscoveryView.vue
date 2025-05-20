<script setup lang="ts">
import { onMounted } from "vue";

import { amethyst } from "@/amethyst.js";
import BigButton from "@/components/BigButton.vue";
import DiscoveryFeed from "@/components/DiscoveryFeed.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
onMounted(() => {
  amethyst.analytics.getDiscoveryTracks();
});

</script>

<template>
  <div class="w-full py-2 pl-4 pr-2 text-text-title">
    <route-header :title="$t('route.discovery')" />
    <div class="flex gap-2 mt-1 mr-2">
      <big-button
        class="flex gap-2"
        icon="mdi:dice-5" 
        @click="amethyst.analytics.getDiscoveryTracks()"
      />
      <big-button
        class="flex gap-2 w-full"
        icon="ic:round-shuffle" 
        title="Just send it"
        description="I can't decide, play something random"
        @click="amethyst.player.playRandomTrack()"
      />
      <big-button
        class="flex gap-2 w-full"
        icon="ic:twotone-favorite" 
        :title="$t('route.favorites')"
        description="View your favorite saved songs"
        @click="$router.push({ name: 'favorites' })"
      />
      <big-button
        class="flex gap-2 w-1/2"
        icon="ic:twotone-menu-book"
        :title="$t('menu.about.user_manual')"
        description="Open the user manual"
        @click="amethyst.openLink('https://amethyst.geoxor.moe/user-manual')"
      />

      <big-button
        class="flex gap-2"
        icon="ic:twotone-settings" 
        title="Settings"
        description="View your settings"
        @click="$router.push({ name: 'settings' })"
      />
    </div>
    <div class="flex flex-col overflow-y-auto pb-32 gap-2 h-full">
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
