<script setup lang="ts">
import { usePlayer, useState } from '../amethyst';
import { Position, VueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/additional-components'

import Queue from "../components/Queue.vue";
import Spectrum from '../components/Spectrum';
import DbMeter from '../components/DbMeter.vue';
import SettingsBar from '../components/SettingsBar.vue';

import Vectorscope from '../components/Vectorscope.vue';
import PlaybackButtons from '../components/PlaybackButtons.vue';
import { ref } from 'vue';
import { getThemeColorHex } from '../logic/color';
import CustomNode from '../components/nodes/CustomNode.vue';
import StepIntoIcon from '../icons/nodes/StepIntoIcon.vue';
import StepOutIcon from '../icons/nodes/StepOutIcon.vue';
import WaveIcon from '../icons/nodes/WaveIcon.vue';

const state = useState();
const player = usePlayer();
const elements = ref([
  {
    id: 'input',
    type: 'custom-input',
    position: { x: 250, y: 250 },
    sourcePosition: Position.Right,
  },

  {
    id: 'output',
    type: 'custom-output',
    position: { x: 750, y: 250 },
    targetPosition: Position.Left,
  },

  {
    id: 'spectrum',
    type: 'custom-spectrum',
    position: { x: 525, y: 350 },
    targetPosition: Position.Left,
  },

  // Edges
  // Most basic edge, only consists of an id, source-id and target-id
  { id: 'input-spectrum', source: 'input', target: 'spectrum', animated: true },
  { id: 'spectrum-output', source: 'spectrum', target: 'output', animated: true },
])
</script>

<template>
  <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
    <div class="flex-1 flex h-full max-h-full overflow-hidden">
      <queue />
      <div class="bg-black font-aseprite bg-opacity-25 p-2 w-full h-full flex">
        <VueFlow v-model="elements" :connection-line-style="{ stroke: getThemeColorHex('--primary-800') }"
          :fit-view-on-init="true" :default-edge-options="{ type: 'smoothstep' }">
          <Background :size="0.5" :variant="BackgroundVariant.Dots"
            :pattern-color="getThemeColorHex('--surface-500')" />
          <template #node-custom-input>
            <CustomNode>
              <div class="flex gap-2 items-center">
                <StepIntoIcon class="text-green-400" />
                <h1 class="text-primary-600 uppercase text-9px">Input</h1>
              </div>

              <h1 class=" text-white text-opacity-30"> Source audio coming from amethyst</h1>

            </CustomNode>
          </template>

          <template #node-custom-output>
            <CustomNode>
              <div class="flex gap-2 items-center">
                <StepOutIcon class="text-green-400" />
                <h1 class="text-primary-600 uppercase text-9px">Output</h1>
              </div>

              <h1 class=" text-white text-opacity-30"> Audio out to speakers</h1>
            </CustomNode>
          </template>

          <template #node-custom-spectrum>
            <CustomNode>
              <div class="flex gap-2 items-center">
                <WaveIcon class="text-green-400" />
                <h1 class="text-primary-600 uppercase text-9px">Spectrum Node</h1>
              </div>

              <spectrum v-if="player.state.source" :key="player.state.currentlyPlayingFilePath"
                :node="player.state.source" />
            </CustomNode>
          </template>

        </VueFlow>
        <!-- <h1>test</h1> -->
      </div>
      <settings-bar class="borderLeft m-2 ml-0" />
    </div>

    <div class="flex gap-2 p-2 bg-surface-800">
      <vectorscope v-if="state.settings.showVectorscope && player.state.source"
        :key="player.state.currentlyPlayingFilePath" :node="player.state.source" />

      <spectrum v-if="state.settings.showSpectrum && player.state.source" :key="player.state.currentlyPlayingFilePath"
        :node="player.state.source" />

      <db-meter v-if="state.settings.showDbMeter && player.state.source" :key="player.state.currentlyPlayingFilePath"
        :node="player.state.source" />

      <playback-buttons :player="player" />
    </div>
  </div>
</template>