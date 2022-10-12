<script setup lang="ts">
import { usePlayer, useState } from '../amethyst';
import { computed, onMounted, ref } from 'vue';

import Queue from "../components/Queue.vue";
import Spectrum from '../components/Spectrum.vue';
import Chip from '../components/new/Chip.vue';
import Cover from '../components/new/Cover.vue';
import DbMeter from '../components/DbMeter.vue';
import SettingsBar from '../components/SettingsBar.vue';

import HeartIcon from '../icons/HeartIcon.vue';
import PlaylistIcon from '../icons/PlaylistIcon.vue';
import PlayIcon from '../icons/PlayIcon.vue';
import NextIcon from '../icons/NextIcon.vue';
import PauseIcon from '../icons/PauseIcon.vue';
import BitrateIcon from "../icons/BitrateIcon.vue";
import FileIcon from "../icons/FileIcon.vue";
import Slider from "../components/input/Slider.vue";
import Vectorscope from '../components/Vectorscope.vue';
// import MetronomeIcon from '../icons/MetronomeIcon.vue';
// import KeyClefIcon from "../icons/KeyClefIcon.vue";
// import StorageIcon from "../icons/StorageIcon.vue";

const state = useState();
const player = usePlayer();
const metadata = computed(() => player.state.currentlyPlayingMetadata);
const duration = computed(() => metadata.value?.format.duration || 0);
const currentTime = ref("0");
const timer = ref();

onMounted(() => {
  // player.loadSoundAndPlay(player.state.currentlyPlayingFilePath);

  timer.value && clearInterval(timer.value);
  timer.value = setInterval(() => {
    currentTime.value = `${player.currentTimeFormatted()} / ${player.currentDurationFormatted()}`;
  }, 1000);

  // waveformRenderer = new WaveformRenderer(player, '#waveformCanvas');
});

const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? player.volumeDown() : player.volumeUp();
};

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const step = duration.value / 10;
  delta < 0 ? player.seekForward(step) : player.seekBackward(step);
};

</script>

<template>
  <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
    <div class="flex-1 flex h-full max-h-full overflow-hidden">
      <queue />
      <settings-bar />
    </div>

    <div class="flex gap-3 p-3 bg-surface-800">
      <vectorscope v-if="state.settings.showVectorscope && player.state.source"
        :key="player.state.currentlyPlayingFilePath" :node="player.state.source" />

      <spectrum v-if="state.settings.showSpectrum && player.state.source" :key="player.state.currentlyPlayingFilePath"
        :node="player.state.source" />

      <db-meter v-if="state.settings.showDbMeter && player.state.source" :key="player.state.currentlyPlayingFilePath"
        :node="player.state.source" />

      <div class="flex flex-col gap-3 justify-between h-full w-full">
        <div class="flex gap-3 items-center justify-between">
          <div class="flex text-primary-900 gap-3">
            <heart-icon class="opacity-75 hover:opacity-100 hover:text-rose-600" />
            <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" />
            <next-icon class="opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
              @click="player.previous()" />
            <pause-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.pause()"
              v-if="player.isPlaying()" />
            <play-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.play()" v-else />
            <next-icon class="opacity-75 hover:opacity-100 hover:text-white" @click="player.next()" />
          </div>

          <slider v-model="player.state.inputAudio.currentTime" @wheel.stop="handleSeekMouseScroll"
            class="w-full z-10 opacity-50" min="0" :max="duration" step="0.01" :id="currentTime" />

          <p class="text-8px">{{player.currentTimeFormatted()}} /
            {{player.currentDurationFormatted()}}</p>

          <slider id="volume" key="volume" v-model="player.state.volume" class="volume max-w-32" min="0" max="1"
            step="0.001" @input="player.setVolume(player.state.volume)" @wheel="handleVolumeMouseScroll" />
        </div>
        <div class="flex items-center justify-between gap-3 tracking-wider h-12">
          <div class="flex gap-2 items-center w-full">
            <cover :url="player.getCoverBase64()" v-if="player.hasCover()" />
            <div class="flex flex-col font-bold gap-2">
              <h1 class="text-12px hover:underline cursor-pointer">{{player.getTitle()}}</h1>
              <p class="text-8px text-white text-opacity-50">{{player.getArtist()}}</p>
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
              {{player.state.currentlyPlayingMetadata?.format.codec}}
            </chip>
            <chip v-if="player.state.currentlyPlayingMetadata?.format.bitrate" :icon="BitrateIcon">
              {{(player.state.currentlyPlayingMetadata?.format.bitrate / 1024).toFixed(2)}}<strong
                class="opacity-50">kbps</strong>
            </chip>
            <!-- <chip :icon="StorageIcon">
              {{(player.getFileSize())}}<strong class="opacity-50"> MB</strong>
            </chip> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>