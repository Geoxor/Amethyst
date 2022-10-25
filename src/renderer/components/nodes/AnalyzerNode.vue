<template >
  <CustomNode :node="node" title="Spectrum Analyzer" :icon="WaveIcon">
    <Spectrum :node="node.node" />
  </CustomNode>
</template>

<script setup lang="ts">
import WaveIcon from '../../icons/material/WaveIcon.vue';
import { AmethystAudioNode } from '../../logic/audio';
import Spectrum from '../visualizers/Spectrum.vue';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
