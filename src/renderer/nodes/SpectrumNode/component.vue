<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystSpectrumNode } from ".";
import SpectrumAnalyzerComposite from "@/components/visualizers/SpectrumAnalyzerComposite.vue";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Spectrum analyzer"
  >
    <spectrum-analyzer-composite
      class="h-76px w-152px"
      type="line"
      :node="node.post"
    />
  </custom-node>
</template>
