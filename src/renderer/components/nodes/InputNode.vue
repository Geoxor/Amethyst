<template >
  <CustomNode :node="node" title="Input" description="From Amethyst" :icon="StepIntoIcon" />
</template>

<script setup lang="ts">
import { AmethystAudioNode } from 'renderer/logic/audio';
import StepIntoIcon from '../../icons/nodes/StepIntoIcon.vue';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
