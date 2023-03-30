<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import NavigationButton from "@/components/NavigationButton.vue";
import { PaintBrushIcon, GeometryIcon, CircusRingOfFireIcon, PuzzleIcon, SineIcon } from "@/icons/material";
</script>

<template>
  <div class="h-full flex w-full">
    <navigation-bar class="w-56">
      <navigation-button
        :icon="PaintBrushIcon"
        :active="$route.name == 'settings.appearance'"
        text="Appearance"
        description="background, themes, visability"
        @click="$router.push({ name: 'settings.appearance' })"
      />
      <navigation-button
        :icon="CircusRingOfFireIcon"
        :active="$route.name == 'settings.performance'"
        text="Performance"
        description="vsync, animations, rendering"
        @click="$router.push({ name: 'settings.performance' })"
      />
      <navigation-button
        :icon="SineIcon"
        :active="$route.name == 'settings.metering'"
        text="Metering"
        description="spectrums, vectorscopes, meters"
        @click="$router.push({ name: 'settings.metering' })"
      />
      <navigation-button
        :icon="GeometryIcon"
        :active="$route.name == 'settings.behaviour'"
        text="Behaviour"
        description="concurrency, startup, defaults"
        @click="$router.push({ name: 'settings.behaviour' })"
      />
      
      <navigation-button
        :icon="PuzzleIcon"
        :active="$route.name == 'settings.integration'"
        text="Integrations"
        description="discord, app integrations, etc"
        @click="$router.push({ name: 'settings.integration' })"
      />
    </navigation-bar>
    <div class="p-4 text-11px w-full h-full flex flex-col gap-2 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
