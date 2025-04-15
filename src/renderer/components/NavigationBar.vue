<script setup lang="ts">
import NavigationButton from "@/components/NavigationButton.vue";
import { AdjustIcon, AmethystIcon, CompassIcon, HeartIcon, ListIcon, PlaylistIcon, SettingsIcon } from "@/icons";
import { amethyst } from "@/amethyst";
</script>

<template>
  <div class="flex flex-col h-full mt-2">
    <navigation-button
      :icon="ListIcon"
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
      :icon="AdjustIcon"
      route-name="node-editor"
    />

    <navigation-button
      :icon="SettingsIcon"
      route-name="settings"
    />

    <navigation-button
      v-if="amethyst.IS_DEV"
      :icon="AmethystIcon"
      route-name="playground"
    />
  </div>
</template>
