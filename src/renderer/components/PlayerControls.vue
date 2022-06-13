<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { usePlayer } from "../amethyst";
import DbMeter from "./DbMeter.vue";

const player = usePlayer();
const currentTime = ref("0");
const timer = ref();
const metadata = computed(() => player.state.currentlyPlayingMetadata );
const duration = computed(() => metadata.value?.format.duration || 0);

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
});
</script>

<template>
  <div class="flex p-1 gap-2 items-center">
    <input
      v-model="player.state.sound.currentTime" class="w-full " min="0" :max="duration" step="0.01"
      type="range" @wheel="handleSeekMouseScroll"
    >
    <h1 class=" whitespace-nowrap text-sm">
      {{ currentTime }}
    </h1>
    <button class="flex items-center text-xl hover:text-blue-300" @click="player.shuffle()">
      ⮀
    </button>
    <button class="flex items-center text-xl hover:text-blue-300" @click="player.previous()">
      {{ '\u{0F049}' }}
      <!--  -->
    </button>
    <button v-if="player.isPlaying()" class="flex items-center text-xl hover:text-blue-300" @click="player.pause()">
      ⏸
    </button>
    <button v-else class="flex items-center text-xl hover:text-blue-300" @click="player.play()">
      ⏵
    </button>
    <button class="flex items-center text-xl hover:text-blue-300" @click="player.next()">
      {{ '\u{0F050}' }}
      <!--  -->
    </button>
    <input
      id="volume" key="volume" v-model="player.state.volume" class="max-w-32" min="0" max="1" step="0.01"
      type="range" @input="player.setVolume(player.state.volume)" @wheel="handleVolumeMouseScroll"
    >
    <db-meter v-if="player.state.source" :key="player.getCurrentlyPlayingFilePath()" :node="player.state.source" />
  </div>
</template>

<style scoped lang="postcss">
</style>
