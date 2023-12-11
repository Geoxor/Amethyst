<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { BugIcon, LargeIconsIcon, SkipIcon, EyeIcon, SearchIcon } from "@/icons";
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
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          title="Spin speed"
          description="How fast the background image will rotate"
          :icon="LargeIconsIcon"
        >
          <slider-input
            v-model="state.settings.value.ambientBackgroundSpinSpeed"
            :min="0"
            :max="64"
            :step="1"
            direction="rtl"
          />
        </settings-setting>
        <settings-setting
          subsetting
          title="Opacity"
          description="How visible the ambient art is over the app"
          :icon="LargeIconsIcon"
        >
          <slider-input
            v-model="state.settings.value.ambientBackgroundOpacity"
            :min="0"
            :max="100"
            :step="1"
          />
        </settings-setting>
        <settings-setting
          subsetting
          title="Blur strength"
          description="How much blur to apply in px"
          :icon="LargeIconsIcon"
        >
          <slider-input
            v-model="state.settings.value.ambientBackgroundBlurStrength"
            :min="0"
            :max="128"
            :step="1"
          />
        </settings-setting>
        <settings-setting
          subsetting
          title="Zoom"
          description="Adjusts the scaling of the ambient art, use it to make sure the art covers the entire screen"
          :icon="SearchIcon"
        >
          <slider-input
            v-model="state.settings.value.ambientBackgroundZoom"
            :min="50"
            :max="250"
            :step="10"
          />
        </settings-setting>
      </div>
    </template>
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
    title="Minimalist mode"
    description="Be less verbose on the UI to keep it clean"
    :icon="EyeIcon"
  >
    <toggle-switch
      v-model="state.settings.value.minimalistMode" 
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