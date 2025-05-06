<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
import { VALID_BUFFER_SIZES, VALID_SAMPLE_RATES } from "@/logic/settings";

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

const {audio} = amethyst.state.settings.value;
</script>

<template>
  <settings-setting
    :title="$t('settings.resampler_rate.title')"
    :description="$t('settings.resampler_rate.description')"
    icon="mdi:abacus"
    :warning="$t('settings.resampler_rate.warning')"
  >
    <dropdown-input
      v-model="audio.resampleRate"
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
      v-model="audio.driver"
      :options="['default', ...systemSpecificAudioDriverOptions]"
    />
    <template
      v-if="audio.driver != 'default'"
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
            v-model="audio.outputRealtimeDeviceName"
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
            v-model="audio.bufferSize"
            :options="VALID_BUFFER_SIZES"
            suffix="smp"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>
