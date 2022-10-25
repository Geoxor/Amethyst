<template >
  <CustomNode :node="node" title="Gain" :icon="AdjustIcon">
    <p class="font-aseprite">{{ ~~(gain * 100) }} %</p>
    <Slider @mousedown.stop v-model="gain" step="0.01" max="3" min="0" />
  </CustomNode>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AdjustIcon from '../../icons/material/AdjustIcon.vue';
import { AmethystGainNode } from '../../logic/audio';
import Slider from '../input/Slider.vue';
import CustomNode from './CustomNode.vue';
const props = defineProps<{ node: AmethystGainNode }>();
const gain = ref(props.node.node.gain.value)
watch(() => gain.value, () => props.node.node.gain.value = gain.value)
</script>
