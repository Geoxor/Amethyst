<script setup lang="ts">
import { useState } from "@/amethyst";
import NavigationButton from "@/components/NavigationButton.vue";
import { ListIcon, SettingsIcon, SelectNoneIcon, PlaystationButtonsIcon, BinocularsIcon } from "@/icons/material";
import { useRoute, useRouter } from "vue-router";
import { useInspector } from "./Inspector";
const state = useState();
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="borderRight flex flex-col">
    <navigation-button
      :icon="SelectNoneIcon"
      :active="route.name == 'node-editor'"
      @click="router.push({ name: 'node-editor' })"
    />

    <navigation-button
      :icon="ListIcon"
      :active="route.name == 'queue'"
      @click="router.push({ name: 'queue' })"
    />

    <!-- <navigation-button
      :icon="BookshelfIcon"
      :active="route.name == 'library'"
      @click="router.push({name: 'library'})"
    /> -->

    <navigation-button
      v-if="state.isDev.value"
      :icon="PlaystationButtonsIcon"
      :active="route.name == 'playground'"
      @click="router.push({ name: 'playground' })"
    />

    <div class="flex-1" />
    <navigation-button
      :icon="BinocularsIcon"
      :active="useInspector().state.isVisible"
      @click="useInspector().state.isVisible = !useInspector().state.isVisible"
    />
    <navigation-button
      :icon="SettingsIcon"
      :active="state.settings.showSettings"
      @click="state.settings.showSettings = !state.settings.showSettings"
    />
  </div>
</template>
