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
      description="Customize background, themes and accessibility"
      :icon="SwatchesIcon"
    />
    <settings-category
      route-name="settings.performance"
      title="Performance"
      :active="false"
      description="Fine-tune vsync, animations and rendering"
      :icon="SpeedometerIcon"
    />
    <settings-category
      route-name="settings.metering"
      title="Metering"
      :active="false"
      description="Adjust spectrums, vectorscope and meters"
      :icon="VoltmeterIcon"
    />
    <settings-category
      route-name="settings.audio"
      title="Audio"
      :active="false"
      description="Manage output devices and presets"
      :icon="SpeakerIcon"
    />
    <settings-category
      route-name="settings.media_sources"
      title="Media Sources"
      :active="false"
      description="Organize folders, connect to servers and more"
      :icon="SSDIcon"
    />
    <settings-category
      route-name="settings.keybinds"
      title="Keybinds"
      :active="false"
      description="Customize key mappings for your experience"
      :icon="KeyboardIcon"
    />
    <settings-category
      route-name="settings.integrations"
      title="Integrations"
      :active="false"
      description="Adjust Discord and other integrations"
      :icon="AddIcon"
    />
    <settings-category
      route-name="settings.application"
      title="Application"
      :active="false"
      description="Manage updates and language preferences"
      :icon="AmethystIcon"
    />
  </div>
</template>
