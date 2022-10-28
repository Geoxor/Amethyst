<template>
  <CustomNode
    :node="node"
    title="Spectrum Analyzer"
    :icon="WaveIcon"
  >
    <Spectrum :node="node.node" />
  </CustomNode>
</template>

<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import Spectrum from "@/components/visualizers/SpectrumAnalyzer.vue";
import WaveIcon from "@/icons/material/WaveIcon.vue";
import { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
