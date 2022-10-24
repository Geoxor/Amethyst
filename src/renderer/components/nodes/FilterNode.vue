<template >
  <CustomNode :node="node" title="Single Band Filter" :icon="FilterIcon">
    <p class="font-aseprite"><strong class="text-white font-aseprite font-thin text-opacity-50">Gain</strong> {{ gain }}
      dB</p>

    <Slider @mousedown.stop v-model="gain" min="-18" max="18" @change="props.node.node.gain.value = gain" />

    <p class="font-aseprite"><strong class="text-white font-aseprite font-thin text-opacity-50">Frequency</strong> {{
        frequency
    }}
      Hz</p>
    <Slider @mousedown.stop v-model="frequency" max="2000" @change="props.node.node.frequency.value = frequency" />
  </CustomNode>
</template>

<script setup lang="ts">
import { AmethystEqualizerNode } from '../../logic/audio';
import { ref } from 'vue';
import FilterIcon from '../../icons/nodes/FilterIcon.vue';
import Slider from '../input/Slider.vue';
import CustomNode from './CustomNode.vue';
const props = defineProps<{ node: AmethystEqualizerNode }>();
const gain = ref(props.node.node.gain.value);
const frequency = ref(props.node.node.frequency.value);
</script>
