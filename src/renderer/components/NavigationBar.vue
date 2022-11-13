<script setup lang="ts">
import { useState } from "@/amethyst";
import NavigationButton from "@/components/NavigationButton.vue";
import ListIcon from "@/icons/material/ListIcon.vue";
import SettingsIcon from "@/icons/material/SettingsIcon.vue";
import SelectNoneIcon from "@/icons/material/SelectNoneIcon.vue";
import { useRoute, useRouter } from "vue-router";
import PlaystationButtonsIcon from "@/icons/material/PlaystationButtonsIcon.vue";
const state = useState();
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="borderRight flex flex-col">
    <navigation-button
      :icon="SelectNoneIcon"
      :active="route.name == 'node-editor'"
      @click="router.push({name: 'node-editor'})"
    />
    
    <navigation-button
      :icon="ListIcon"
      :active="route.name == 'queue-list'"
      @click="router.push({name: 'queue-list'})"
    />
    
    <navigation-button
      v-if="state.isDev"
      :icon="PlaystationButtonsIcon"
      :active="route.name == 'playground-view'"
      @click="router.push({name: 'playground-view'})"
    />

    <div class="flex-1" />

    <navigation-button
      :icon="SettingsIcon"
      :active="state.settings.showSettings"
      @click="state.settings.showSettings = !state.settings.showSettings"
    />
  </div>
</template>
