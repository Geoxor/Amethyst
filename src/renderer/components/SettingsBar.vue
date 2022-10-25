<template>
  <padded-container class="w-64 min-w-64 borderLeft m-2 ml-0">

    <settings-category-splitter text="UI" />
    <settings-binary-switch text="Color UI based on cover art" v-model="state.settings.colorInterfaceFromCoverart" />

    <settings-category-splitter text="Covers" />
    <settings-binary-switch text="Show cover art" v-model="state.settings.showCoverArt" />

    <settings-category-splitter text="Queue List" />
    <settings-binary-switch text="Show mini covers" v-model="state.settings.showMiniCovers" />

    <settings-category-splitter text="Vectorscope" />
    <settings-binary-switch text="Enabled" v-model="state.settings.showVectorscope" />
    <settings-binary-switch text="Diagonal" v-model="state.settings.diagonalVectorscope" />

    <settings-modifier text="Line thickness" :min="0.1" :max="5" :step="0.50" :def="1"
      v-model="state.settings.vectorscopeLineThickness" />

    <settings-category-splitter text="Spectrum" />
    <settings-binary-switch text="Enabled" v-model="state.settings.showSpectrum" />
    <settings-binary-switch text="Logarithmic spectrum" v-model="state.settings.useLogarithmicSpectrum" />
    <settings-modifier text="Vertical zoom" :min="0.5" :max="2" :step="0.1" :def="1.5"
      v-model="state.settings.spectrumVerticalZoom" />
    <settings-modifier text="Smoothing" :min="0.01" :max="0.99" :step="0.1" :def="0.5"
      v-model="state.settings.spectrumSmoothing" />
    <settings-modifier text="FFT Size" :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
      :def="8192" v-model="state.settings.spectrumFftSize" />

    <settings-category-splitter text="dB Meter" />
    <settings-binary-switch text="Enabled" v-model="state.settings.showDbMeter" />

    <settings-category-splitter text="Integrations" />
    <settings-binary-switch text="Discord Rich Presence" v-model="state.settings.discordRichPresence" />

    <div class="flex-col flex gap-2">
      <splitter />
      <div class="opacity-20 flex justify-between items-center">
        Made by: <img src="../geoxor_logo.svg" class="h-2" alt="">
      </div>
    </div>

  </padded-container>
</template>

<script setup lang="ts">
import { useState } from '@/amethyst';
import PaddedContainer from '@/components/PaddedContainer.vue';
import SettingsBinarySwitch from '@/components/settings/SettingsBinarySwitch.vue';
import SettingsCategorySplitter from '@/components/settings/SettingsCategorySplitter.vue';
import SettingsModifier from '@/components/settings/SettingsModifier.vue';
import Splitter from '@/components/Splitter.vue';
const state = useState();

</script>
