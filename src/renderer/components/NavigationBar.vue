<script setup lang="ts">
import { amethyst } from "@/amethyst";
import NavigationButton from "@/components/NavigationButton.vue";
import { AmethystIcon } from "@/icons";
</script>

<template>
  <div class="flex flex-col h-full mt-2">
    <navigation-button
      icon="ic:twotone-queue-music"
      route-name="queue"
    />

    <!-- <navigation-button
      :icon="CompassIcon"
      route-name="discover"
    /> -->
          
    <!-- <navigation-button
      :icon="PlaylistIcon"
      route-name="playlists"
    /> -->

    <!-- <navigation-button
      :icon="HeartIcon"
      route-name="favorites"
    /> -->

    <navigation-button
      icon="ic:twotone-format-list-bulleted"
      route-name="node-editor"
    />

    <navigation-button
      icon="ic:twotone-settings"
      route-name="settings"
    />

    <navigation-button
      v-if="amethyst.IS_DEV"
      :icon="AmethystIcon"
      route-name="playground"
    />
  </div>
</template>
