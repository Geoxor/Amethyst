<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
const state = useState();
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