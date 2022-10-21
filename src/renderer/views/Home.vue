<script setup lang="ts">
import { usePlayer, useState } from '../amethyst';

import Queue from "../components/Queue.vue";
import Spectrum from '../components/Spectrum';
import DbMeter from '../components/DbMeter.vue';
import SettingsBar from '../components/SettingsBar.vue';

import Vectorscope from '../components/Vectorscope.vue';
import PlaybackButtons from '../components/PlaybackButtons.vue';

const state = useState();
const player = usePlayer();

</script>

<template>
  <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
    <div class="flex-1 flex h-full max-h-full overflow-hidden">
      <queue />
      <settings-bar class="borderLeft" />
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