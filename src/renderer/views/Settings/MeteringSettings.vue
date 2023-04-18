<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {WaveIcon, SineIcon} from "@/icons/material";
const state = useState();
</script>

<template>
  <settings-group
    text="Decibel Meter"
    :icon="SineIcon"
    description="Displays a visual representation of the sound level of the audio signal in decibels (dB). It displays the current sound level of the audio signal using a graph, where the y-axis represents the sound level in decibels. The decibel meter can be used to monitor the overall loudness of the audio signal and to ensure that it is within safe listening levels."
  >
    <template #main>
      <base-switch v-model="state.settings.value.showDbMeter" />
    </template>
    <settings-binary-switch
      v-model="state.settings.value.decibelMeterSeperatePrePost"
      text="Seperate PRE and POST"
    />
    <settings-modifier
      v-model="state.settings.value.decibelMeterMinimumDb"
      :def="state.defaultSettings.decibelMeterMinimumDb"
      text="Minimum dB"
      :min="-120"
      :max="0"
      :step="1"
    />
    <settings-modifier
      v-model="state.settings.value.decibelMeterFftSize"
      :def="state.defaultSettings.decibelMeterFftSize"
      text="FFT size"
      :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
    />
  </settings-group>
  <settings-group
    text="Loudness Meter"
    :icon="SineIcon"
    description="Displays a visual representation of the perceived loudness of the audio signal. The loudness meter is measured in Loudness Units Full Scale (LUFS), which is a standardized measurement of perceived loudness."
  >
    <template #main>
      <base-switch v-model="state.settings.value.showLoudnessMeter" />
    </template>
  </settings-group>

  <settings-group
    text="Vectorscope"
    :icon="SineIcon"
    description="Displays a visual representation of the stereo audio signal. It displays the relative phase and stereo width of the audio signal using a circular graph. The vectorscope can be used to check the stereo imaging and phase coherence of the audio signal."
  >
    <template #main>
      <base-switch v-model="state.settings.value.showVectorscope" />
    </template>
    
    <settings-modifier
      v-model="state.settings.value.vectorscopeFftSize"
      :def="state.defaultSettings.vectorscopeFftSize"
      text="FFT size"
      :range="[32, 64, 128, 256, 512, 1024]"
    />

    <settings-binary-switch
      v-model="state.settings.value.lissajousVectorscope"
      text="Lissajous"
    />
    <settings-modifier
      v-model="state.settings.value.vectorscopeLineThickness"
      text="Line thickness"
      :min="0.1"
      :max="5"
      :step="0.50"
      :def="state.defaultSettings.vectorscopeLineThickness"
    />
  </settings-group>

  <settings-group
    text="Spectrum Analyser"
    :icon="WaveIcon"
    description="Displays a visual representation of the frequency content of the audio signal. It displays the frequency spectrum of the audio signal using a graph, where the x-axis represents the frequency range and the y-axis represents the amplitude. The spectrum analyzer can be used to analyze the frequency balance of the audio signal and to identify frequency peaks or notches."
  >
    <template #main>
      <base-switch v-model="state.settings.value.showSpectrum" />
    </template>

    <settings-binary-switch
      v-model="state.settings.value.useLogarithmicSpectrum"
      text="Logarithmic spectrum"
    />

    <settings-modifier
      v-model="state.settings.value.spectrumSmoothing"
      text="Smoothing"
      :min="0.01"
      :max="0.99"
      :step="0.1"
      :def="state.defaultSettings.spectrumSmoothing"
    />
    <settings-modifier
      v-model="state.settings.value.spectrumFftSize"
      text="FFT size"
      :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
      :def="state.defaultSettings.spectrumFftSize"
    />
  </settings-group>
</template>
