<template >
  <CustomNode :node="node" title="Input" description="From Amethyst" :icon="StepIntoIcon" />
</template>

<script setup lang="ts">
import StepIntoIcon from '../../icons/material/StepIntoIcon.vue';
import { AmethystAudioNode } from '../../logic/audio';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
