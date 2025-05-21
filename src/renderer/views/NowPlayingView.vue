<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";
import CoverArt from "@/components/CoverArt.vue";
import BaseSlider from "@/components/input/BaseSlider.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import TitleSubtitle from "@/components/v2/TitleSubtitle.vue";
import TitleText from "@/components/v2/TitleText.vue";
import SpectrumAnalyzerComposite from "@/components/visualizers/SpectrumAnalyzerComposite.vue";
import VectorscopeAnalyzer from "@/components/visualizers/VectorscopeAnalyzer.vue";
const currentTrack = computed(() => amethyst.player.getCurrentTrack());

const showVectorscope = useLocalStorage('showVectorscopeOverCover', false);
</script>

<template>
  <div class="flex flex-col justify-end h-full items-center w-full text-text-title">
    <template v-if="currentTrack?.getCover() && !showVectorscope">
      <cover-art :url="currentTrack?.getCover()" class="w-full h-auto top-1/6 opacity-50 filter blur-48 absolute-xy rounded-8px transform-gpu scale-125 "/>
      <div :url="currentTrack?.getCover()" class="w-full h-64 bg-gradient-to-t absolute-xy top-32 from-transparent  to-surface-900"/>
    </template>

    <div class="absolute-xy top-5/16 flex flex-col items-center gap-4">
      <cover-art v-if="!showVectorscope" :url="currentTrack?.getCover()"
        class="w-72 h-72 rounded-8px "
        @click="showVectorscope = true" />


      <VectorscopeAnalyzer v-else :width='72*4' :height='72*4' :node="amethyst.player.nodeManager.master.pre" class="w-72 h-72 rounded-8px "
        @click="showVectorscope = false"
      />

      <title-subtitle alignment="center" class="truncate text-ellipsis"
        :title="currentTrack?.getTitleFormatted() || 'Amethyst'"
        :subtitle="currentTrack?.getArtistsFormatted() || 'Amethyst'" />

      <PlaybackButtons v-if="amethyst.getCurrentPlatform() == 'mobile'" class="z-1 transform-gpu scale-150" />

    </div>
    <div class="w-7/8 flex gap-2 flex-col">
      <base-slider v-if="amethyst.getCurrentPlatform() == 'mobile'" v-model="amethyst.player.currentTime.value"
        class="h-2px rounded-full" :max="amethyst.player.input.duration" :step="0.001"
        @input="amethyst.player.seekTo(amethyst.player.currentTime.value)" />

      <div class="flex justify-between">
        <TitleText :text="amethyst.player.currentTimeFormatted(true)"/>
        <TitleText :text="currentTrack?.getDurationFormatted(true) || ''"/>
      </div>

    </div>

    <div class="w-full h-224px">
      <spectrum-analyzer-composite :node="amethyst.player.nodeManager.master.pre"
        :type="amethyst.state.settings.metering.spectrum.type" />
    </div>
  </div>
</template>
