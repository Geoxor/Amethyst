<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import NavigationButton from "@/components/NavigationButton.vue";
import { PaintBrushIcon, CircusRingOfFireIcon, PuzzleIcon, SineIcon, AmethystIcon } from "@/icons/material";
</script>

<template>
  <div class="h-full flex w-full">
    <navigation-bar class="w-56">
      <navigation-button
        :icon="AmethystIcon"
        text="Application"
        description="automatic updates, language, etc"
        route-name="settings.application"
      />

      <navigation-button
        :icon="PaintBrushIcon"
        text="Appearance"
        description="background, themes, visability"
        route-name="settings.appearance"
      />
      <navigation-button
        :icon="CircusRingOfFireIcon"
        text="Performance"
        description="vsync, animations, rendering"
        route-name="settings.performance"
      />
      <navigation-button
        :icon="SineIcon"
        text="Metering"
        description="spectrums, vectorscopes, meters"
        route-name="settings.metering"
      />
      
      <navigation-button
        :icon="PuzzleIcon"
        text="Integrations"
        description="discord, app integrations, etc"
        route-name="settings.integration"
      />
    </navigation-bar>
    <div class="p-4 text-11px w-full h-full flex flex-col gap-2 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
