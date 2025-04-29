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
</template>
