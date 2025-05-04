<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer.vue";
import type { AmethystSpectrumNode } from ".";
import {amethyst} from "@/amethyst";
import {getThemeColor} from "@/logic/color";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Spectrum analyzer"
    icon="ic:twotone-graphic-eq"
  >
    <spectrum-analyzer
      class="h-76px w-152px"
      :node="node.post"
      :fft-size="amethyst.state.settings.value.spectrumFftSize"
      :smoothing="amethyst.state.settings.value.spectrumSmoothing"
      :accent-color="getThemeColor('--accent')"
      :paused="amethyst.shouldPauseVisualizers()"
    />
  </custom-node>
</template>
