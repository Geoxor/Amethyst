<script setup lang="ts">
import { useState } from "@/amethyst";
import NavigationButton from "@/components/NavigationButton.vue";
import ListIcon from "@/icons/material/ListIcon.vue";
import SettingsIcon from "@/icons/material/SettingsIcon.vue";
const state = useState();
</script>

<template>
  <div class="borderRight">
    <navigation-button
      :icon="ListIcon"
      :active="state.settings.showQueue"
      @click="state.settings.showQueue = !state.settings.showQueue"
    />

    <navigation-button
      :icon="SettingsIcon"
      :active="state.settings.showSettings"
      @click="state.settings.showSettings = !state.settings.showSettings"
    />
  </div>
</template>
