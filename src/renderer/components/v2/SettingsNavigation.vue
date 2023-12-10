<script setup lang="ts">
import SettingsCategory from "@/components/v2/SettingsCategory.vue";
import { AddIcon, AmethystIcon, KeyboardIcon, SSDIcon, SpeakerIcon, SpeedometerIcon, SwatchesIcon, VoltmeterIcon } from "@/icons";
</script>

<template>
  <div class="flex w-min flex-col">
    <settings-category
      title="Appearance"
      route-name="settings.appearance"
      :active="false"
      subtitle="background, themes, accessibility"
      :icon="SwatchesIcon"
    />
    <settings-category
      route-name="settings.performance"
      title="Performance"
      :active="false"
      subtitle="vsync, animations, rendering"
      :icon="SpeedometerIcon"
    />
    <settings-category
      route-name="settings.metering"
      title="Metering"
      :active="false"
      subtitle="spectrums, vectorscope, meters"
      :icon="VoltmeterIcon"
    />
    <settings-category
      route-name="settings.audio"
      title="Audio"
      :active="false"
      subtitle="output devices, default presets"
      :icon="SpeakerIcon"
    />
    <settings-category
      route-name="settings.media_sources"
      title="Media Sources"
      :active="false"
      subtitle="folders, subsonic servers, etc"
      :icon="SSDIcon"
    />
    <settings-category
      route-name="settings.keybinds"
      title="Keybinds"
      :active="false"
      subtitle="change key mappings"
      :icon="KeyboardIcon"
    />
    <settings-category
      route-name="settings.integrations"
      title="Integrations"
      :active="false"
      subtitle="discord, etc"
      :icon="AddIcon"
    />
    <settings-category
      route-name="settings.application"
      title="Application"
      :active="false"
      subtitle="updates, language"
      :icon="AmethystIcon"
    />
  </div>
</template>