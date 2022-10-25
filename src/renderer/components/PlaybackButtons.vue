<template>
  <div class="flex flex-col gap-2 justify-between h-full w-full">
    <div class="flex gap-2 items-center justify-between">
      <div class="flex text-primary-900 gap-2">
        <!-- TODO: fix this scuff shit, turn each song into a class instance already -->
        <heart-icon class="opacity-75 hover:opacity-100 hover:text-rose-600"
          :class="[player.state.favorites.has(player.getCurrentlyPlayingFilePath()) && 'text-rose-600 opacity-100']"
          @click="player.favoriteToggle(player.getCurrentlyPlayingFilePath())" />
        <!-- <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" /> -->
        <next-icon class="opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
          @click="player.previous()" />
        <pause-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.pause()"
          v-if="player.isPlaying()" />
        <play-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.play()" v-else />
        <next-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.next()" />

        <shuffle-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.shuffle()" />

        <repeat-icon v-if="player.state.loopMode == LoopMode.None" class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.loopAll()" />

        <repeat-icon v-if="player.state.loopMode == LoopMode.All" class="opacity-100 text-gray-300 hover:text-white"
          @click="player.loopOne()" />

        <repeat-one-icon v-if="player.state.loopMode == LoopMode.One" class="opacity-100 text-gray-300 hover:text-white"
          @click="player.loopNone()" />
      </div>

      <slider v-model="player.state.inputAudio.currentTime" @wheel.stop="handleSeekMouseScroll"
        class="w-full z-10 opacity-50" min="0" :max="duration" step="0.01" :id="player.state.currentTime" />

      <p class="text-8px">{{ player.currentTimeFormatted() }} /
        {{ player.currentDurationFormatted() }}</p>

      <slider id="volume" key="volume" v-model="player.state.volume" class="volume max-w-32" min="0" max="1"
        step="0.001" @input="player.setVolume(player.state.volume)" @wheel="handleVolumeMouseScroll" />
    </div>
    <div class="flex items-center justify-between gap-3 tracking-wider h-12">
      <div class="flex gap-2 items-center w-full">
        <cover class="rounded-4px w-12 h-12 min-h-12 min-w-12"
          :url="player.getCoverBase64(player.getCurrentlyPlayingFilePath())" v-if="player.hasCover()" />
        <div class="flex flex-col font-bold gap-2">
          <h1 class="text-12px hover:underline cursor-pointer"
            @click="invoke('show-item', [player.getCurrentlyPlayingFilePath()])">{{ player.getTitle() }}</h1>
          <p class="text-8px text-white text-opacity-50">{{ player.getArtist() }}</p>
        </div>

      </div>
      <div class="flex gap-1 text-8px font-bold">
        <!-- <chip :icon="MetronomeIcon">
              128<strong class="opacity-50">bpm</strong>
            </chip>
            <chip :icon="KeyClefIcon">
              D# Pentatonic
            </chip> -->
        <chip v-if="player.state.currentlyPlayingMetadata?.format.codec" :icon="FileIcon">
          {{ player.state.currentlyPlayingMetadata?.format.codec }}
        </chip>
        <chip v-if="player.state.currentlyPlayingMetadata?.format.bitrate" :icon="BitrateIcon">
          {{ (player.state.currentlyPlayingMetadata?.format.bitrate / 1024).toFixed(2) }}<strong
            class="opacity-50">kbps</strong>
        </chip>
        <!-- <chip :icon="StorageIcon">
              {{(player.getFileSize())}}<strong class="opacity-50"> MB</strong>
            </chip> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cover from '@/components/Cover.vue';
import Slider from "@/components/input/Slider.vue";
import Chip from '@/components/new/Chip.vue';
import BitrateIcon from "@/icons/plumpy/BitrateIcon.vue";
import FileIcon from "@/icons/plumpy/FileIcon.vue";
import HeartIcon from '@/icons/plumpy/HeartIcon.vue';
import NextIcon from '@/icons/plumpy/NextIcon.vue';
import PauseIcon from "@/icons/plumpy/PauseIcon.vue";
import PlayIcon from '@/icons/plumpy/PlayIcon.vue';
import RepeatIcon from '@/icons/plumpy/RepeatIcon.vue';
import RepeatOneIcon from '@/icons/plumpy/RepeatOneIcon.vue';
import ShuffleIcon from '@/icons/plumpy/ShuffleIcon.vue';
import { LoopMode } from "@/player";
// import MetronomeIcon from '@/icons/plumpy/MetronomeIcon.vue';
// import KeyClefIcon from "@/icons/plumpy/KeyClefIcon.vue";
// import StorageIcon from "@/icons/plumpy/StorageIcon.vue";

import Player from '@/player';
import { computed, onMounted, ref } from 'vue';
const invoke = window.electron.ipcRenderer.invoke;
const props = defineProps<{ player: Player }>();
const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? props.player.volumeDown() : props.player.volumeUp();
};


const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const step = duration.value / 10;
  delta < 0 ? props.player.seekForward(step) : props.player.seekBackward(step);
};

const metadata = computed(() => props.player.state.currentlyPlayingMetadata);
const duration = computed(() => metadata.value?.format.duration || 0);
const currentTime = ref("0");
const timer = ref();

onMounted(() => {
  // player.loadSoundAndPlay(player.state.currentlyPlayingFilePath);

  timer.value && clearInterval(timer.value);
  timer.value = setInterval(() => {
    currentTime.value = `${props.player.currentTimeFormatted()} / ${props.player.currentDurationFormatted()}`;
  }, 1000);

  // waveformRenderer = new WaveformRenderer(player, '#waveformCanvas');
});

</script>
