<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {WaveIcon} from "@/icons/material";
import { AmethystSpectrumNode } from ".";
import GPUSpectrumAnalyzer from "@/components/visualizers/GPUSpectrumAnalyzer.vue";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Spectrum Analyzer"
    :icon="WaveIcon"
  >
    <GPUSpectrumAnalyzer
      class="h-76px w-152px"
      :node="node.audioNode"
    />
  </CustomNode>
</template>
