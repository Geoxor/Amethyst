<template>
  <div class="w-64 borderRight overflow-x-hidden text-12px whitespace-nowrap">
    <div class="p-4 flex flex-col gap-4">
      <settings-category-splitter text="Queue List" />
      <settings-modifier text="Smooth scroll speed" :min="0.01" :max="0.5" :step="0.001" :default="0.075"
        v-model="state.settings.smoothScrollSpeed" />
      <settings-category-splitter text="Spectrum" />
      <settings-binary-switch text="Logarithmic Spectrum" v-model="state.settings.useLogarithmicSpectrum" />
      <settings-modifier text="Vertical zoom" :min="0.5" :max="2" :step="0.1" :default="1.5"
        v-model="state.settings.spectrumVerticalZoom" />
      <settings-modifier text="Smoothing" :min="0.01" :max="0.99" :step="0.01" :default="0.5"
        v-model="state.settings.spectrumSmoothing" />
      <settings-modifier text="FFT Size" :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
        :default="8192" v-model="state.settings.spectrumFftSize" />
      <settings-category-splitter text="dB Meter" />
      <settings-binary-switch text="Show instant dB values" v-model="state.settings.showInstantDecibelValues" />
      <settings-binary-switch text="Show average dB values" v-model="state.settings.showAverageDecibelValues" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from '../amethyst';
import SettingsCategorySplitter from './settings/SettingsCategorySplitter.vue';
import SettingsBinarySwitch from './settings/SettingsBinarySwitch.vue';
import SettingsModifier from './settings/SettingsModifier.vue';

const state = useState();
</script>
