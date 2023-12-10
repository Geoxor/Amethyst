<script setup lang="ts">
import SettingsCategory from "@/components/v2/SettingsCategory.vue";
import { AddIcon, AmethystIcon, KeyboardIcon, SSDIcon, SpeakerIcon, SpeedometerIcon, SwatchesIcon, VoltmeterIcon } from "@/icons";
</script>

<template>
  <div class="flex w-min flex-col">
    <settings-category
      title="Appearance"
      :active="false"
      subtitle="background, themes, accessibility"
      :icon="SwatchesIcon"
    />
    <settings-category
      title="Performance"
      :active="false"
      subtitle="vsync, animations, rendering"
      :icon="SpeedometerIcon"
    />
    <settings-category
      title="Metering"
      :active="false"
      subtitle="spectrums, vectorscope, meters"
      :icon="VoltmeterIcon"
    />
    <settings-category
      title="Audio"
      :active="false"
      subtitle="output devices, default presets"
      :icon="SpeakerIcon"
    />
    <settings-category
      title="Media Sources"
      :active="false"
      subtitle="folders, subsonic servers, etc"
      :icon="SSDIcon"
    />
    <settings-category
      title="Keybinds"
      :active="false"
      subtitle="change key mappings"
      :icon="KeyboardIcon"
    />
    <settings-category
      title="Integrations"
      :active="false"
      subtitle="discord, etc"
      :icon="AddIcon"
    />
    <settings-category
      title="Application"
      :active="false"
      subtitle="updates, language"
      :icon="AmethystIcon"
    />
  </div>
</template>