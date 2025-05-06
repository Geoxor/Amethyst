<script setup lang="ts">
import { amethyst } from "@/amethyst";
import CustomNode from "@/components/nodes/CustomNode.vue";
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer.vue";
import { getThemeColor } from "@/logic/color";
import type { AmethystSpectrumNode } from ".";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Spectrum analyzer"
  >
    <spectrum-analyzer
      class="h-76px w-152px"
      :node="node.post"
      :fft-size="amethyst.state.settings.value.metering.spectrum.fftSize"
      :smoothing="amethyst.state.settings.value.metering.spectrum.smoothing"
      :accent-color="getThemeColor('--accent')"
      :paused="amethyst.shouldPauseVisualizers()"
      :line-thickness="amethyst.state.settings.value.metering.spectrum.lineThickness"
      :fill-opacity="amethyst.state.settings.value.metering.spectrum.fillOpacity"
      :opacity-falloff="amethyst.state.settings.value.metering.spectrum.opacityFalloff"
    />
  </custom-node>
</template>
