<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {AzimuthIcon} from "@/icons/material";
import { AmethystPannerNode } from "@/logic/audio";
import { ref, watch } from "vue";
const props = defineProps<{ node: AmethystPannerNode }>();
const pan = ref(props.node.audioNode.pan.value);
watch(() => pan.value, () => props.node.audioNode.pan.value = pan.value);
</script>

<template>
  <CustomNode
    :node="node"
    title="Stereo Panner"
    :icon="AzimuthIcon"
  >
    <p class="font-aseprite">
      {{ pan }}
    </p>
    <Slider
      v-model="pan"
      step="0.01"
      max="1"
      min="-1"
      @mousedown.stop
    />
  </CustomNode>
</template>
