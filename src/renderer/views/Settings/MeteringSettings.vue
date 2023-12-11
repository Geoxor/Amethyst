<script setup lang="ts">
import { useState } from "@/amethyst";
// import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
// import BaseSwitch from "@/components/input/BaseSwitch.vue";
// import SettingsGroup from "@/components/settings/SettingsGroup.vue";
// import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {AmethystIcon, AxisIcon, SineIcon, VoltmeterIcon, WaveIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
const state = useState();
</script>

<template>
  <settings-setting
    title="Decibel Meter"
    :icon="VoltmeterIcon"
    description="Displays a visual representation of the sound level of the audio signal in decibels (dB). It displays the current sound level of the audio signal using a graph, where the y-axis represents the sound level in decibels. The decibel meter can be used to monitor the overall loudness of the audio signal and to ensure that it is within safe listening levels."
  >
    <toggle-switch v-model="state.settings.value.showDbMeter" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          title="Seperate PRE and POST"
          description="Shows individual decibel meters, one for the signal before going into a node and one after"
          :icon="VoltmeterIcon"
        >
          <toggle-switch
            v-model="state.settings.value.decibelMeterSeperatePrePost" 
          />
        </settings-setting>
      </div>
    </template>

    <!-- <settings-binary-switch
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
    /> -->
  </settings-setting>
  <settings-setting
    title="Loudness Meter"
    :icon="WaveIcon"
    description="Displays a visual representation of the perceived loudness of the audio signal. The loudness meter is measured in Loudness Units Full Scale (LUFS), which is a standardized measurement of perceived loudness."
  >
    <toggle-switch v-model="state.settings.value.showLoudnessMeter" />
  </settings-setting>

  <settings-setting
    title="Vectorscope"
    :icon="AxisIcon"
    description="Displays a visual representation of the stereo audio signal. It displays the relative phase and stereo width of the audio signal using a circular graph. The vectorscope can be used to check the stereo imaging and phase coherence of the audio signal."
  >
    <toggle-switch v-model="state.settings.value.showVectorscope" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          title="Lissajous"
          description="Display diagonally in a lissajous pattern"
          :icon="AxisIcon"
        >
          <toggle-switch
            v-model="state.settings.value.lissajousVectorscope" 
          />
        </settings-setting>
      </div>
    </template>
    <!--     
    <settings-modifier
      v-model="state.settings.value.vectorscopeFftSize"
      :def="state.defaultSettings.vectorscopeFftSize"
      text="FFT size"
      :range="[32, 64, 128, 256, 512, 1024]"
    />

    <settings-modifier
      v-model="state.settings.value.vectorscopeLineThickness"
      text="Line thickness"
      :min="0.1"
      :max="5"
      :step="0.50"
      :def="state.defaultSettings.vectorscopeLineThickness"
    /> -->
  </settings-setting>

  <settings-setting
    title="Spectrum Analyser"
    :icon="SineIcon"
    description="Displays a visual representation of the frequency content of the audio signal. It displays the frequency spectrum of the audio signal using a graph, where the x-axis represents the frequency range and the y-axis represents the amplitude. The spectrum analyzer can be used to analyze the frequency balance of the audio signal and to identify frequency peaks or notches."
  >
    <toggle-switch v-model="state.settings.value.showSpectrum" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          title="Logarithmic spectrum"
          description="Use logarithmic scaling for frequencies"
          :icon="SineIcon"
        >
          <toggle-switch
            v-model="state.settings.value.useLogarithmicSpectrum" 
          />
        </settings-setting>
      </div>
    </template>

    <!-- 

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
    /> -->
  </settings-setting>
</template>
