<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import SpectrumAnalyzerComposite from "@/components/visualizers/SpectrumAnalyzerComposite.vue";
import type { AmethystSpectrumNode } from ".";
defineProps<{ node: AmethystSpectrumNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Spectrum analyzer"
  >
    <spectrum-analyzer-composite
      class="min-h-[76px] min-w-[152px]"
      type="line"
      :node="node.post"
    />
  </custom-node>
</template>
