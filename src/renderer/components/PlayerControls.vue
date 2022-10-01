<script setup lang="ts">
// import { WaveformRenderer } from '../waveformRenderer';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { usePlayer } from "../amethyst";

const player = usePlayer();
const currentTime = ref("0");
const timer = ref();
const metadata = computed(() => player.state.currentlyPlayingMetadata);
const duration = computed(() => metadata.value?.format.duration || 0);
// let waveformRenderer: WaveformRenderer

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

  // waveformRenderer = new WaveformRenderer(player, '#waveformCanvas');
});

onUnmounted(() => {
  // waveformRenderer.clean();
});

</script>

<template>
  <div class="flex p-1 gap-2 items-center h-4">
    <div class="w-full h-full relative flex">
      <input v-model="player.state.inputAudio.currentTime" class="w-full z-10 opacity-50" min="0" :max="duration"
        step="0.01" type="range" @wheel.stop="handleSeekMouseScroll">
    </div>
    <h1 class=" whitespace-nowrap text-sm">
      {{ currentTime }}
    </h1>
  </div>
</template>
