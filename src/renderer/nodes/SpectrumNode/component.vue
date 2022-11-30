<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import { WaveIcon } from "@/icons/material";
import { AmethystSpectrumNode } from ".";
import { SpectrumAnalyzer } from "@/components/visualizers/SpectrumAnalyzer";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Spectrum Analyzer"
    :icon="WaveIcon"
  >
    <SpectrumAnalyzer
      class="h-76px w-152px"
      :node="node.audioNode"
    />
  </CustomNode>
</template>
