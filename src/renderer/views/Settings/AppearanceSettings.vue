<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { BugIcon, LargeIconsIcon, SkipIcon } from "@/icons";
const state = useState();

const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

</script>

<template>
  <settings-setting
    title="Ambient background"
    description="Presents an overlay of the cover art for the currently playing song on the UI"
    :icon="LargeIconsIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showAmbientBackground" 
    />
  </settings-setting>
  <settings-setting
    title="Playback controls"
    description="Display the playback controls at the bottom of the application"
    :icon="SkipIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showPlaybackControls" 
    />
  </settings-setting>
  <settings-setting
    title="Cover art"
    description="Render the cover art near the playback controls located at the bottom of the interface"
    :icon="LargeIconsIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showCoverArt" 
    />
  </settings-setting>
  <settings-setting
    title="Debug statistics"
    description="Show numbers such as samples, fps, processor usage and mroe at the top bar."
    :icon="BugIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showDebugStats" 
    />
  </settings-setting>
</template>