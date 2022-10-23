<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Position, VueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/additional-components'
import { getThemeColorHex } from '../logic/color';
import CustomNode from '../components/nodes/CustomNode.vue';
import StepIntoIcon from '../icons/nodes/StepIntoIcon.vue';
import StepOutIcon from '../icons/nodes/StepOutIcon.vue';
import WaveIcon from '../icons/nodes/WaveIcon.vue';
import Spectrum from './Spectrum/Spectrum.vue';
import { usePlayer, useState } from '../amethyst';
import MagnetIcon from '../icons/MagnetIcon.vue';
import SquareButton from './SquareButton.vue';
const dash = ref();

// Fit to view again when resizing
onMounted(() => {
  window.addEventListener('resize', () => dash.value.fitView());
});

const player = usePlayer();
const state = useState();
const elements = ref([
  {
    id: 'input',
    type: 'custom-input',
    position: { x: 0, y: 250 },
    sourcePosition: Position.Right,
  },

  {
    id: 'spectrum',
    type: 'custom-spectrum',
    position: { x: 300, y: 350 },
    targetPosition: Position.Left,
  },

  {
    id: 'output',
    type: 'custom-output',
    position: { x: 700, y: 250 },
    targetPosition: Position.Left,
  },

  // Edges
  // Most basic edge, only consists of an id, source-id and target-id
  { id: 'input-spectrum', source: 'input', target: 'spectrum', animated: true },
  { id: 'spectrum-output', source: 'spectrum', target: 'output', animated: true },
])
</script>

<template>
  <div class="w-full h-full flex flex-col borderLeft relative">

    <SquareButton class="absolute bottom-2 right-2 z-10 " :icon="MagnetIcon" :active="state.settings.isSnappingToGrid"
      @click="state.settings.isSnappingToGrid = !state.settings.isSnappingToGrid" />

    <VueFlow ref="dash" class="bg-black bg-opacity-25 p-2" :snap-to-grid="state.settings.isSnappingToGrid"
      v-model="elements" :connection-line-style="{ stroke: getThemeColorHex('--primary-800') }" :fit-view-on-init="true"
      :default-edge-options="{ type: 'smoothstep' }">
      <Background :size="0.5" :variant="BackgroundVariant.Dots" :pattern-color="getThemeColorHex('--surface-500')" />
      <template #node-custom-input>
        <CustomNode title="Input" description="From Amethyst" :icon="StepIntoIcon" />
      </template>

      <template #node-custom-output>
        <CustomNode title="Output" description="To Speakers" :icon="StepOutIcon" />
      </template>

      <template #node-custom-spectrum>
        <CustomNode title="Spectrum" :icon="WaveIcon">
          <spectrum v-if="player.state.source" :key="player.state.currentlyPlayingFilePath"
            :node="player.state.source" />
        </CustomNode>
      </template>

    </VueFlow>
    <!-- <h1>test</h1> -->
  </div>
</template>

<style>
.magnet:hover {
  @apply bg-cyan-300 text-surface-900;
}

.magnet.active {
  @apply bg-cyan-400 text-surface-900;
}

.magnet.active:hover {
  @apply bg-cyan-500 text-surface-900;
}
</style>