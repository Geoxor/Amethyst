<script setup lang="ts">
import { useState } from "@/amethyst";
// import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
// import BaseSwitch from "@/components/input/BaseSwitch.vue";
// import SettingsGroup from "@/components/settings/SettingsGroup.vue";
// import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {AxisIcon, SineIcon, VoltmeterIcon, WaveIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
const state = useState();

const FFT_SIZES = [
  16, 
  32, 
  64, 
  128, 
  256, 
  512, 
  1024, 
  2048, 
  4096, 
  8192, 
  16384,
];

</script>

<template>
  <settings-setting
    :title="$t('settings.decibel_meter.title')"
    :icon="VoltmeterIcon"
    :description="$t('settings.decibel_meter.description')"
  >
    <toggle-switch v-model="state.settings.value.showDbMeter" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.decibel_meter.separate_pre_post.title')"
          :description="$t('settings.decibel_meter.separate_pre_post.description')"
          :icon="VoltmeterIcon"
        >
          <toggle-switch
            v-model="state.settings.value.decibelMeterSeperatePrePost"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.decibel_meter.minimum_db.title')"
          :description="$t('settings.decibel_meter.minimum_db.description')"
          :icon="VoltmeterIcon"
        >
          <slider-input
            v-model="state.settings.value.decibelMeterMinimumDb"
            :min="-90"
            :max="-6"
            :step="1"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          :icon="VoltmeterIcon"
        >
          <dropdown-input
            v-model="state.settings.value.decibelMeterFftSize"
            :options="FFT_SIZES"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.loudness_meter.title')"
    :icon="WaveIcon"
    :description="$t('settings.loudness_meter.description')"
  >
    <toggle-switch v-model="state.settings.value.showLoudnessMeter" />
  </settings-setting>

  <settings-setting
    :title="$t('settings.vectorscope.title')"
    :icon="AxisIcon"
    :description="$t('settings.vectorscope.description')"
  >
    <toggle-switch v-model="state.settings.value.showVectorscope" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.vectorscope.lissajous.title')"
          :description="$t('settings.vectorscope.lissajous.description')"
          :icon="AxisIcon"
        >
          <toggle-switch
            v-model="state.settings.value.lissajousVectorscope"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.vectorscope.line_thickness.title')"
          :description="$t('settings.vectorscope.line_thickness.description')"
          :icon="VoltmeterIcon"
        >
          <slider-input
            v-model="state.settings.value.vectorscopeLineThickness"
            :min="0.1"
            :max="10"
            :step="1"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          :icon="VoltmeterIcon"
        >
          <dropdown-input
            v-model="state.settings.value.vectorscopeFftSize"
            :options="FFT_SIZES"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.spectrum_analyser.title')"
    :icon="SineIcon"
    :description="$t('settings.spectrum_analyser.description')"
  >
    <toggle-switch v-model="state.settings.value.showSpectrum" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.spectrum_analyser.logarithmic_spectrum.title')"
          :description="$t('settings.spectrum_analyser.logarithmic_spectrum.description')"
          :icon="SineIcon"
        >
          <toggle-switch
            v-model="state.settings.value.useLogarithmicSpectrum"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          :icon="VoltmeterIcon"
        >
          <dropdown-input
            v-model="state.settings.value.spectrumFftSize"
            :options="FFT_SIZES"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>