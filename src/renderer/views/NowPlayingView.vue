<script setup lang="ts">
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";
import CoverArt from "@/components/CoverArt.vue";
import BaseSlider from "@/components/input/BaseSlider.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import TitleSubtitle from "@/components/v2/TitleSubtitle.vue";
import TitleText from "@/components/v2/TitleText.vue";
import SpectrumAnalyzerComposite from "@/components/visualizers/SpectrumAnalyzerComposite.vue";
import { getThemeColor } from "@/logic/color";
const currentTrack = computed(() => amethyst.player.getCurrentTrack());
</script>

<template>
  <div class="flex flex-col justify-end pb-8 h-full items-center w-full p-2 text-text-title">
    <div class="absolute-xy top-1/3 flex flex-col items-center gap-4">
      <cover-art :url="currentTrack?.getCover()"
        class="w-72 h-72 rounded-8px " />

      <title-subtitle alignment="center" class="truncate text-ellipsis"
        :title="currentTrack?.getTitleFormatted() || 'Amethyst'"
        :subtitle="currentTrack?.getArtistsFormatted() || 'Amethyst'" />

      <PlaybackButtons v-if="amethyst.getCurrentPlatform() == 'mobile'" class="z-1 transform-gpu scale-150" />


    </div>
    <div class="w-7/8 flex gap-2 mb-28 flex-col">

      <base-slider v-if="amethyst.getCurrentPlatform() == 'mobile'" v-model="amethyst.player.currentTime.value"
        class="h-2px rounded-full" :max="amethyst.player.input.duration" :step="0.001"
        @input="amethyst.player.seekTo(amethyst.player.currentTime.value)" />

      <div class="flex justify-between">
        <TitleText :text="amethyst.player.currentTimeFormatted(true)"/>
        <TitleText :text="currentTrack?.getDurationFormatted(true) || ''"/>
      </div>

    </div>

    <div class="w-full h-64px">
      <spectrum-analyzer-composite key="big-spectrum-analyzer" :node="amethyst.player.nodeManager.master.pre"
        :type="amethyst.state.settings.metering.spectrum.type" />
    </div>
    <div class="w-full h-32px bg-accent/15"></div>
  </div>
</template>
