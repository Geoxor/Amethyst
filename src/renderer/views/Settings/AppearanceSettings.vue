<script setup lang="ts">
import { useState } from "@/amethyst";
import BaseKeyboardButton from "@/components/input/BaseKeyboardButton.vue";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {PlayIcon, ImageIcon, BugIcon} from "@/icons/material";
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
  <settings-group
    :icon="ImageIcon"
    text="Ambient Background"
    description="Presents an overlay of the cover art for the currently playing song on the user interface."
  >
    <template #main>
      <base-switch v-model="state.settings.value.showAmbientBackground" />
    </template>

    <settings-binary-switch
      v-model="state.settings.value.ambientBackgroundSpin"
      text="Spin"
    />
    <settings-modifier
      v-model="state.settings.value.ambientBackgroundSpinSpeed"
      text="Spin speed"
      :min="1"
      :max="64"
      :step="1"
      :def="state.defaultSettings.ambientBackgroundSpinSpeed"
    />
    <settings-modifier
      v-model="state.settings.value.ambientBackgroundBlurStrength"
      text="Blur strength"
      :min="0"
      :max="256"
      :step="1"
      :def="state.defaultSettings.ambientBackgroundBlurStrength"
    />

    <settings-modifier
      v-model="state.settings.value.ambientBackgroundZoom"
      text="Zoom"
      :min="0"
      :max="1000"
      :step="1"
      :def="state.defaultSettings.ambientBackgroundZoom"
    />
    
    <settings-modifier
      v-model="state.settings.value.ambientBackgroundOpacity"
      text="Opacity"
      :min="0"
      :max="100"
      :step="1"
      :def="state.defaultSettings.ambientBackgroundOpacity"
    />

    <div class="text-primary-900 w-full gap-2 flex items-center justify-between hover:text-primary-800">
      Mix Blend Mode
      <select
        v-model="state.settings.value.ambientBackgroundBlendMode"
        class="bg-surface-600 w-full max-w-24 h-6 font-aseprite font-thin py-2"
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
    </div>
  </settings-group>

  <settings-group 
    :icon="ImageIcon"
    description="Render the cover art near the playback controls located at the bottom of the interface."
    text="Cover art"
  >
    <template #main>
      <base-switch v-model="state.settings.value.showCoverArt" />
    </template>
  </settings-group>

  <settings-group 
    :icon="PlayIcon"
    description="Display the playback controls at the bottom of the application."
    text="Playback controls"
  >
    <template #main>
      <base-keyboard-button
        :button="'F10'"
      >
        F10
      </base-keyboard-button>

      <base-switch v-model="state.settings.value.showPlaybackControls" />
    </template>
  </settings-group>

  <settings-group
    :icon="BugIcon"
    text="Debug Statistics"
    description="Show numbers such as samples, fps, processor usage and more at the top bar."
  >
    <template #main>
      <base-keyboard-button
        :button="'F9'"
      >
        F9
      </base-keyboard-button>

      <base-switch v-model="state.settings.value.showDebugStats" />
    </template>
  </settings-group>
</template>