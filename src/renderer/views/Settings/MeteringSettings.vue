<script setup lang="ts">
import { useState } from "@/amethyst";
// import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
// import BaseSwitch from "@/components/input/BaseSwitch.vue";
// import SettingsGroup from "@/components/settings/SettingsGroup.vue";
// import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {AxisIcon, SineIcon, VoltmeterIcon, WaveIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
const state = useState();
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
      </div>
    </template>
  </settings-setting>
</template>