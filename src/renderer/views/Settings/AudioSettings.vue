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

const systemSpecificAudioDriverOptions: string[] = [];

switch (amethyst.getCurrentOperatingSystem()) {
  case "windows":
    systemSpecificAudioDriverOptions.push("asio");
    break;
  case "linux":
    systemSpecificAudioDriverOptions.push("alsa");
    break;
  case "mac":
    systemSpecificAudioDriverOptions.push("coreaudio");
    break;
  default:
    break;
}

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
    icon="mdi:audio-input-xlr"
  >
    <dropdown-input
      v-model="amethyst.state.settings.value.audioDriver"
      :options="['default', ...systemSpecificAudioDriverOptions]"
    />
    <template
      v-if="amethyst.state.settings.value.audioDriver == 'asio'"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          :title="$t('settings.audio_driver.audio_device.title')"
          :description="$t('settings.audio_driver.audio_device.description')"
          icon="mdi:audio-video"
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
          icon="material-symbols:memory-alt-rounded"
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
