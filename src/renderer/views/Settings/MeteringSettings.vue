<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
const state = useState();
</script>

<template>
  <settings-category-splitter text="Loudness Meter" />
  <settings-binary-switch
    v-model="state.settings.showLoudnessMeter"
    text="Enabled"
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
    text="Show spectrum"
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
</template>
