<script setup lang="ts">
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer.vue";
import {amethyst} from "@/amethyst";
import {getThemeColor} from "@/logic/color";
import SpectrumBarAnalyzer from "@/components/visualizers/SpectrumBarAnalyzer.vue";
import SpectrogramAnalyzer from "@/components/visualizers/SpectrogramAnalyzer.vue";
import {SPECTRUM_TYPES_STRING} from "@/logic/settings";

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
    :fft-size="amethyst.state.settings.value.metering.spectrum.fftSize"
    :smoothing="amethyst.state.settings.value.metering.spectrum.smoothing"
    :line-thickness="amethyst.state.settings.value.metering.spectrum.lineThickness"
    :fill-opacity="amethyst.state.settings.value.metering.spectrum.fillOpacity"
    :opacity-falloff="amethyst.state.settings.value.metering.spectrum.opacityFalloff"
    :paused="amethyst.shouldPauseVisualizers()"
  />
  <spectrum-bar-analyzer
    v-else-if="type === 'bars'"
    :node="node"
    :accent-color="getThemeColor('--accent')"
    :fft-size="amethyst.state.settings.value.metering.spectrumBars.fftSize"
    :smoothing="amethyst.state.settings.value.metering.spectrumBars.smoothing"
    :bars="amethyst.state.settings.value.metering.spectrumBars.bars"
    :paused="amethyst.shouldPauseVisualizers()"
  />
  <spectrogram-analyzer
    v-else-if="type === 'spectrogram'"
    :node="node"
    :accent-color="getThemeColor('--accent')"
    :fft-size="amethyst.state.settings.value.metering.spectrogram.fftSize"
    :smoothing="amethyst.state.settings.value.metering.spectrogram.smoothing"
    :bars="amethyst.shouldPauseVisualizers()"
  />
</template>