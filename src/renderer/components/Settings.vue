<template>
  <div class="w-64 borderRight overflow-x-hidden text-12px whitespace-nowrap">
    <div class="p-4 flex flex-col gap-4">
      <settings-category-splitter text="Spectrum" />
      <settings-binary-switch text="Logarithmic Spectrum" v-model="state.settings.useLogarithmicSpectrum" />
      <settings-category-splitter text="dB Meter" />
      <settings-binary-switch text="Show instant dB values" v-model="state.settings.showInstantDecibelValues" />
      <settings-binary-switch text="Show average dB values" v-model="state.settings.showAverageDecibelValues" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from '../amethyst';
import SettingsCategorySplitter from './settings/SettingsCategorySplitter.vue';
import SettingsBinarySwitch from './settings/SettingsBinarySwitch.vue';

const state = useState();
</script>

<style scoped lang="postcss">
</style>