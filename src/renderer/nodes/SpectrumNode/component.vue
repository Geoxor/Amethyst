<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import { SpectrumAnalyzer } from "@/components/visualizers/SpectrumAnalyzer";
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
    />
  </custom-node>
</template>
