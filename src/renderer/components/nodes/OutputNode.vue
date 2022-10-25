<template >
  <CustomNode meterless :node="node" title="Output" description="To Speakers" :icon="StepOutIcon"></CustomNode>
</template>

<script setup lang="ts">
import StepOutIcon from '../../icons/material/StepOutIcon.vue';
import { AmethystAudioNode } from '../../logic/audio';
import CustomNode from './CustomNode.vue';
defineProps<{ node: AmethystAudioNode<any> }>();

</script>
