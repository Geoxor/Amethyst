<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
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
  <settings-category-splitter text="Ambient Background" />
  <settings-binary-switch
    v-model="state.settings.showAmbientBackground"
    text="Enabled"
  />
  <settings-binary-switch
    v-model="state.settings.ambientBackgroundSpin"
    text="Spin"
  />
  <settings-modifier
    v-model="state.settings.ambientBackgroundSpinSpeed"
    text="Spin speed"
    :min="1"
    :max="64"
    :step="0.01"
    :def="state.defaultSettings.ambientBackgroundSpinSpeed"
  />
  <settings-modifier
    v-model="state.settings.ambientBackgroundBlurStrength"
    text="Blur strength"
    :min="0"
    :max="256"
    :step="1"
    :def="state.defaultSettings.ambientBackgroundBlurStrength"
  />

  Mix Blend Mode
  <select
    v-model="state.settings.ambientBackgroundBlendMode"
    class="bg-surface-600 w-full font-aseprite font-thin py-2"
    @keydown.stop
  >
    <option
      v-for="mode of BLEND_MODES"
      :key="mode"
      class="text-10px"
      :value="mode"
    >
      {{ mode }}
    </option>
  </select>

  <settings-modifier
    v-model="state.settings.ambientBackgroundOpacity"
    text="Opacity"
    :min="0"
    :max="100"
    :step="1"
    :def="state.defaultSettings.ambientBackgroundOpacity"
  />

  <settings-category-splitter text="Covers" />
  <settings-binary-switch
    v-model="state.settings.showCoverArt"
    text="Show cover art"
  />

  <settings-category-splitter text="Playback Controls" />
  <settings-binary-switch
    v-model="state.settings.showPlaybackControls"
    text="Show"
  />
</template>