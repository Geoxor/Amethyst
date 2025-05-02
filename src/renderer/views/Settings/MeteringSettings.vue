<script setup lang="ts">
import { amethyst } from "@/amethyst";
// import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
// import BaseSwitch from "@/components/input/BaseSwitch.vue";
// import SettingsGroup from "@/components/settings/SettingsGroup.vue";
// import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { FFT_SIZES } from "@shared/constants";

</script>

<template>
  <settings-setting
    :title="$t('settings.decibel_meter.title')"
    icon="ic:twotone-speed"
    :description="$t('settings.decibel_meter.description')"
  >
    <toggle-switch v-model="amethyst.state.settings.value.showDbMeter" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.decibel_meter.separate_pre_post.title')"
          :description="$t('settings.decibel_meter.separate_pre_post.description')"
          icon="ic:twotone-speed"
        >
          <toggle-switch
            v-model="amethyst.state.settings.value.decibelMeterSeperatePrePost"
          />
        </settings-setting>

        <settings-setting
          subsetting
          :title="$t('settings.decibel_meter.minimum_db.title')"
          :description="$t('settings.decibel_meter.minimum_db.description')"
          icon="ic:twotone-speed"
        >
          <slider-input
            v-model="amethyst.state.settings.value.decibelMeterMinimumDb"
            :min="-90"
            :max="-6"
            :step="1"
            suffix="dB"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          icon="ic:twotone-line-style"
        >
          <dropdown-input
            v-model="amethyst.state.settings.value.decibelMeterFftSize"
            :options="FFT_SIZES"
            suffix="smp"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.decibel_meter.smoothing_duration.title')"
          :description="$t('settings.decibel_meter.smoothing_duration.description')"
          icon="ic:twotone-access-time"
        >
          <slider-input
            v-model="amethyst.state.settings.value.meterSmoothingDuration"
            :min="0"
            :max="300"
            :step="10"
            suffix="ms"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.loudness_meter.title')"
    icon="ic:twotone-waves"
    :description="$t('settings.loudness_meter.description')"
  >
    <toggle-switch v-model="amethyst.state.settings.value.showLoudnessMeter" />
  </settings-setting>

  <settings-setting
    :title="$t('settings.vectorscope.title')"
    icon="ic:twotone-fiber-smart-record"
    :description="$t('settings.vectorscope.description')"
  >
    <toggle-switch v-model="amethyst.state.settings.value.showVectorscope" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.vectorscope.lissajous.title')"
          :description="$t('settings.vectorscope.lissajous.description')"
          icon="ic:twotone-fitbit"
        >
          <toggle-switch
            v-model="amethyst.state.settings.value.lissajousVectorscope"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.vectorscope.line_thickness.title')"
          :description="$t('settings.vectorscope.line_thickness.description')"
          icon="ic:twotone-drive-file-rename-outline"
        >
          <slider-input
            v-model="amethyst.state.settings.value.vectorscopeLineThickness"
            :min="0.1"
            :max="10"
            :step="1"
            suffix="px"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          icon="ic:twotone-line-style"
        >
          <dropdown-input
            v-model="amethyst.state.settings.value.vectorscopeFftSize"
            :options="FFT_SIZES"
            suffix="smp"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.spectrum_analyser.title')"
    icon="ic:twotone-graphic-eq"
    :description="$t('settings.spectrum_analyser.description')"
  >
    <toggle-switch v-model="amethyst.state.settings.value.showSpectrum" />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.spectrum_analyser.smoothing_duration.title')"
          :description="$t('settings.spectrum_analyser.smoothing_duration.description')"
          icon="ic:twotone-access-time"
        >
          <slider-input
            v-model="amethyst.state.settings.value.spectrumSmoothing"
            :min="0"
            :max="1"
            :step="0.01"
            suffix="ms"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.fft_size.title')"
          :description="$t('settings.fft_size.description')"
          icon="ic:twotone-line-style"
        >
          <dropdown-input
            v-model="amethyst.state.settings.value.spectrumFftSize"
            :options="FFT_SIZES"
            suffix="smp"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>