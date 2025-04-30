<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
const VALID_SAMPLE_RATES = [
  4000,
  8000,
  11025,
  16000,
  22050,
  44100,
  48000,
  88200,
  96000,
  176400,
  192000,
  352800,
  384000,
];

const VALID_BUFFER_SIZES = [256, 512, 1024];

</script>

<template>
  <settings-setting
    :title="$t('settings.resampler_rate.title')"
    :description="$t('settings.resampler_rate.description')"
    icon="mdi:abacus"
    warning="Reload Required"
  >
    <dropdown-input
      v-model="amethyst.state.settings.value.resampleRate"
      :options="VALID_SAMPLE_RATES"
      suffix="Hz"
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.audio_driver.title')"
    :description="$t('settings.audio_driver.description')"
    icon="mdi:abacus"
  >
    <dropdown-input
      v-model="amethyst.state.settings.value.audioDriver"
      :options="['default', 'asio']"
    />
    <template
      v-if="amethyst.state.settings.value.audioDriver == 'asio'"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          :title="$t('settings.audio_driver.audio_device.title')"
          :description="$t('settings.audio_driver.audio_device.description')"
          icon="mdi:abacus"
          subsetting
        >
          <dropdown-input
            v-model="amethyst.state.settings.value.outputRealtimeAudioDeviceName"
            :options="amethyst.state.realtimeDevices.value.map(dev => dev.name)"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.audio_driver.audio_device.buffer.title')"
          :description="$t('settings.audio_driver.audio_device.buffer.description')"
          icon="mdi:abacus"
          subsetting
        >
          <dropdown-input
            v-model="amethyst.state.settings.value.bufferSize"
            :options="VALID_BUFFER_SIZES"
            suffix="smp"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>
