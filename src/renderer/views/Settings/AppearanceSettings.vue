<script setup lang="ts">
import { useState } from "@/amethyst";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import { SkipIcon } from "@/icons";
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
    title="Playback controls"
    description="Display the playback controls at the bottom of the application"
    :icon="SkipIcon"
  >
    <base-switch
      v-model="state.settings.value.showPlaybackControls" 
    />
  </settings-setting>
</template>