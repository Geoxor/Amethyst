<template >
  <CustomNode meterless :node="node" title="Output" description="To Speakers" :icon="StepOutIcon"></CustomNode>
</template>

<script setup lang="ts">
import { AmethystAudioNode } from 'renderer/logic/audio';
import StepOutIcon from '../../icons/nodes/StepOutIcon.vue';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
