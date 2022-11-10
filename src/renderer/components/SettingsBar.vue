<script setup lang="ts">
import { useState } from "@/amethyst";
import PaddedContainer from "@/components/PaddedContainer.vue";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import Splitter from "@/components/SplitterLine.vue";
const state = useState();

</script>

<template>
  <padded-container class="w-64 text-primary-900 min-w-64 m-2 ml-0">
    <settings-category-splitter text="Ambient Background" />
    <settings-binary-switch
      v-model="state.settings.showAmbientBackground"
      text="Enabled"
    />
    <settings-modifier
      v-model="state.settings.ambientBackgroundOpacity"
      text="Opacity"
      :min="0"
      :max="100"
      :step="1"
      :def="state.defaultSettings.ambientBackgroundOpacity"
    />

    <settings-modifier
      v-model="state.settings.abmientBackgroundBlurStrength"
      text="Blur strength"
      :min="32"
      :max="256"
      :step="1"
      :def="state.defaultSettings.abmientBackgroundBlurStrength"
    />

    <settings-category-splitter text="Covers" />
    <settings-binary-switch
      v-model="state.settings.showCoverArt"
      text="Show cover art"
    />

    <settings-category-splitter text="Queue List" />
    <settings-binary-switch
      v-model="state.settings.showMiniCovers"
      text="Show mini covers"
    />

    <settings-category-splitter text="Vectorscope" />
    <settings-binary-switch
      v-model="state.settings.showVectorscope"
      text="Enabled"
    />
    <settings-binary-switch
      v-model="state.settings.diagonalVectorscope"
      text="Diagonal"
    />

    <settings-modifier
      v-model="state.settings.vectorscopeLineThickness"
      text="Line thickness"
      :min="0.1"
      :max="5"
      :step="0.50"
      :def="state.defaultSettings.vectorscopeLineThickness"
    />

    <settings-category-splitter text="Spectrum" />
    <settings-binary-switch
      v-model="state.settings.showSpectrum"
      text="Enabled"
    />
    <settings-binary-switch
      v-model="state.settings.useLogarithmicSpectrum"
      text="Logarithmic spectrum"
    />
    <settings-modifier
      v-model="state.settings.spectrumVerticalZoom"
      text="Vertical zoom"
      :min="0.5"
      :max="2"
      :step="0.1"
      :def="state.defaultSettings.spectrumVerticalZoom"
    />
    <settings-modifier
      v-model="state.settings.spectrumSmoothing"
      text="Smoothing"
      :min="0.01"
      :max="0.99"
      :step="0.1"
      :def="state.defaultSettings.spectrumSmoothing"
    />
    <settings-modifier
      v-model="state.settings.spectrumFftSize"
      text="FFT Size"
      :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
      :def="state.defaultSettings.spectrumFftSize"
    />

    <settings-category-splitter text="dB Meter" />
    <settings-binary-switch
      v-model="state.settings.showDbMeter"
      text="Enabled"
    />

    <settings-category-splitter text="Integrations" />
    <settings-binary-switch
      v-model="state.settings.useDiscordRichPresence"
      text="Discord Rich Presence"
    />

    <div class="flex-col flex gap-2">
      <splitter />
      <div class="opacity-20 flex justify-between items-center">
        Made by: <img
          src="../geoxor_logo.svg"
          class="h-2"
          alt=""
        >
      </div>
    </div>
  </padded-container>
</template>
