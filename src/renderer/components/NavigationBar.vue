<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import NavigationButton from "@/components/NavigationButton.vue";
</script>

<template>
  <div class="flex flex-col h-full mt-2">
    <navigation-button
      icon="ic:twotone-queue-music"
      route-name="queue"
    />

    <navigation-button
      icon="ic:twotone-library-music"
      route-name="discovery"
    />

    <navigation-button
      icon="ic:twotone-favorite"
      route-name="favorites"
    />

    <navigation-button
      icon="mdi:resistor-nodes"
      route-name="node-editor"
    />

    <navigation-button
      icon="ic:twotone-mic-external-on"
      route-name="audio-monitor"
    />

    <navigation-button
      icon="ic:twotone-settings"
      route-name="settings"
    />

    <navigation-button
      v-if="amethyst.IS_DEV"
      icon="ic:twotone-bug-report"
      route-name="playground"
    />
  </div>
</template>
