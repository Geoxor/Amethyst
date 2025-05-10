<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import SpectrogramAnalyzer from "@/components/visualizers/SpectrogramAnalyzer.vue";
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer.vue";
import SpectrumBarAnalyzer from "@/components/visualizers/SpectrumBarAnalyzer.vue";
import { getThemeColor } from "@/logic/color";
import type { SPECTRUM_TYPES_STRING } from "@/logic/settings";

defineProps<{
  node: AudioNode,
  type: SPECTRUM_TYPES_STRING
}>();

</script>

<template>
  <spectrum-analyzer
    v-if="type === 'line'"
    :node="node"
    :accent-color="getThemeColor('--accent')"
    :fft-size="amethyst.state.settings.metering.spectrumLine.fftSize"
    :smoothing="amethyst.state.settings.metering.spectrumLine.smoothing"
    :line-thickness="amethyst.state.settings.metering.spectrumLine.lineThickness"
    :fill-opacity="amethyst.state.settings.metering.spectrumLine.fillOpacity"
    :opacity-falloff="amethyst.state.settings.metering.spectrumLine.opacityFalloff"
    :max-decibels="amethyst.state.settings.metering.spectrumLine.maxDecibels"
    :min-decibels="amethyst.state.settings.metering.spectrumLine.minDecibels"
    :paused="amethyst.shouldPauseVisualizers()"
  />
  <spectrum-bar-analyzer
    v-else-if="type === 'bars'"
    :node="node"
    :accent-color="getThemeColor('--accent')"
    :fft-size="amethyst.state.settings.metering.spectrumBars.fftSize"
    :smoothing="amethyst.state.settings.metering.spectrumBars.smoothing"
    :bars="amethyst.state.settings.metering.spectrumBars.bars"
    :paused="amethyst.shouldPauseVisualizers()"
  />
  <spectrogram-analyzer
    v-else-if="type === 'spectrogram'"
    :node="node"
    :accent-color="getThemeColor('--accent')"
    :fft-size="amethyst.state.settings.metering.spectrogram.fftSize"
    :smoothing="amethyst.state.settings.metering.spectrogram.smoothing"
    :bars="amethyst.shouldPauseVisualizers()"
  />
</template>