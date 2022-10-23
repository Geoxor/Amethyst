<script setup lang="ts">
import { useState } from '../amethyst';
import PlaylistIcon from '../icons/PlaylistIcon.vue';
import SettingsIcon from '../icons/SettingsIcon.vue';
import NavigationButton from './NavigationButton.vue';

const state = useState();
</script>

<template>
  <div class="borderRight">
    <NavigationButton :icon="PlaylistIcon" :active="state.settings.showQueue"
      @click="state.settings.showQueue = !state.settings.showQueue" />

    <NavigationButton :icon="SettingsIcon" :active="state.settings.showSettings"
      @click="state.settings.showSettings = !state.settings.showSettings" />
  </div>
</template>
