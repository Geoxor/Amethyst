<script setup lang="ts">
import { useState } from "@/amethyst";
import NavigationButton from "@/components/NavigationButton.vue";
import MasterIcon from "@/icons/material/MasterIcon.vue";
import PlaylistIcon from "@/icons/plumpy/PlaylistIcon.vue";
import SettingsIcon from "@/icons/plumpy/SettingsIcon.vue";
const state = useState();
</script>

<template>
  <div class="borderRight">
    <NavigationButton
      :icon="PlaylistIcon"
      :active="state.settings.showQueue"
      @click="state.settings.showQueue = !state.settings.showQueue"
    />

    <NavigationButton
      :icon="SettingsIcon"
      :active="state.settings.showSettings"
      @click="state.settings.showSettings = !state.settings.showSettings"
    />

    <NavigationButton
      :icon="MasterIcon"
      :active="state.settings.showNodeEditor"
      @click="state.settings.showNodeEditor = !state.settings.showNodeEditor"
    />
  </div>
</template>
