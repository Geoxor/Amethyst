<script setup lang="ts">
import { WaveformRenderer } from '../waveformRenderer';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { usePlayer, useState } from "../amethyst";
import DbMeter from "./DbMeter.vue";
import PlaybackButton from './input/PlaybackButton.vue';
import StopIcon from '../icons/StopIcon.vue';
import PlayIcon from '../icons/PlayIcon.vue';
import PauseIcon from "../icons/PauseIcon.vue";
import LoopIcon from '../icons/LoopIcon.vue';
import ShuffleIcon from '../icons/ShuffleIcon.vue';
import SkipIcon from '../icons/SkipIcon.vue';
const player = usePlayer();
const state = useState();
const currentTime = ref("0");
const timer = ref();
const metadata = computed(() => player.state.currentlyPlayingMetadata);
const duration = computed(() => metadata.value?.format.duration || 0);
let waveformRenderer: WaveformRenderer

const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? player.volumeDown() : player.volumeUp();
};

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const step = duration.value / 10;
  delta < 0 ? player.seekForward(step) : player.seekBackward(step);
};

onMounted(() => {
  // player.loadSoundAndPlay(player.state.currentlyPlayingFilePath);

  timer.value && clearInterval(timer.value);
  timer.value = setInterval(() => {
    currentTime.value = `${player.currentTimeFormatted()} / ${player.currentDurationFormatted()}`;
  }, 500);

  waveformRenderer = new WaveformRenderer(player, '#waveformCanvas');
});

onUnmounted(() => {
  waveformRenderer.clean();
});

</script>

<template>
  <div class="flex p-1 gap-2 items-center">
    <div class="w-full h-full relative flex">
      <canvas id="waveformCanvas" class="w-full h-full absolute"></canvas>
      <input v-model="player.state.inputAudio.currentTime" class="w-full z-10 opacity-50" min="0" :max="duration"
        step="0.01" type="range" @wheel.stop="handleSeekMouseScroll">
    </div>
    <h1 class=" whitespace-nowrap text-sm">
      {{ currentTime }}
    </h1>

    <div class="flex">
      <playback-button :icon="ShuffleIcon" @pressed="player.shuffle()" />
      <playback-button :icon="LoopIcon" @pressed="player.state.loop = !player.state.loop"
        :is-active="player.state.loop" />
      <playback-button :icon="SkipIcon" class="transform rotate-y-180" @pressed="player.previous()" />
      <playback-button :icon="PlayIcon" v-if="!player.state.isPlaying" @pressed="player.play()" />
      <playback-button :icon="PauseIcon" v-else @pressed="player.pause()" />
      <playback-button :icon="SkipIcon" @pressed="player.next()" />
      <playback-button :icon="StopIcon" @pressed="player.setCurrentlyPlayingIndex(0); player.pause()" />
    </div>

    <input id="volume" key="volume" v-model="player.state.volume" class="max-w-32" min="0" max="1" step="0.01"
      type="range" @input="player.setVolume(player.state.volume)" @wheel="handleVolumeMouseScroll">
    <db-meter v-if="state.settings.showDbMeter && player.state.source" :key="player.getCurrentlyPlayingFilePath()"
      :node="player.state.source" />
  </div>
</template>

<style scoped lang="postcss">
</style>
