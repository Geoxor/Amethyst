<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {WaveIcon} from "@/icons/material";
import { AmethystAudioNode } from "@/logic/audio";
import GPUSpectrumAnalyzer from "../visualizers/GPUSpectrumAnalyzer.vue";
defineProps<{ node: AmethystAudioNode<any> }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Spectrum Analyzer"
    :icon="WaveIcon"
  >
    <GPUSpectrumAnalyzer
      class="h-76px w-152px"
      :node="node.node"
    />
  </CustomNode>
</template>
