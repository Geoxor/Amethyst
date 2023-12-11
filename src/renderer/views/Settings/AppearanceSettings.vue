<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { BugIcon, LargeIconsIcon, SkipIcon, EyeIcon, SearchIcon } from "@/icons";
const state = useState();

// const BLEND_MODES = [
//   "normal",
//   "multiply",
//   "screen",
//   "overlay",
//   "darken",
//   "lighten",
//   "color-dodge",
//   "color-burn",
//   "hard-light",
//   "soft-light",
//   "difference",
//   "exclusion",
//   "hue",
//   "saturation",
//   "color",
//   "luminosity",
// ];

</script>

<template>
  <settings-setting
    :title="$t('settings.animation_duration.title')"
    :description="$t('settings.animation_duration.description')"
    :icon="SkipIcon"
  >
    <slider-input
      v-model="state.settings.value.animationDuration"
      :min="0"
      :max="300"
      :step="10"
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.ambient_background.title')"
    :description="$t('settings.ambient_background.description')"
    :icon="LargeIconsIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showAmbientBackground" 
    />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.spin_speed.title')"
          :description="$t('settings.ambient_background.spin_speed.description')"
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
          :title="$t('settings.ambient_background.opacity.title')"
          :description="$t('settings.ambient_background.opacity.description')"
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
          :title="$t('settings.ambient_background.blur_strength.title')"
          :description="$t('settings.ambient_background.blur_strength.description')"
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
          :title="$t('settings.ambient_background.zoom.title')"
          :description="$t('settings.ambient_background.zoom.description')"
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
    :title="$t('settings.playback_controls.title')"
    :description="$t('settings.playback_controls.description')"
    :icon="SkipIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showPlaybackControls" 
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.minimalist_mode.title')"
    :description="$t('settings.minimalist_mode.description')"
    :icon="EyeIcon"
  >
    <toggle-switch
      v-model="state.settings.value.minimalistMode" 
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.cover_art.title')"
    :description="$t('settings.cover_art.description')"
    :icon="LargeIconsIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showCoverArt" 
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.debug_stats.title')"
    :description="$t('settings.debug_stats.description')"
    :icon="BugIcon"
  >
    <toggle-switch
      v-model="state.settings.value.showDebugStats" 
    />
  </settings-setting>
</template>