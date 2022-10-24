<template >
  <CustomNode :node="node" title="Spectrum Analyzer" :icon="WaveIcon">
    <Spectrum :node="node.node" />
  </CustomNode>
</template>

<script setup lang="ts">
import { AmethystAudioNode } from 'renderer/logic/audio';
import WaveIcon from '../../icons/nodes/WaveIcon.vue';
import Spectrum from '../Spectrum';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
