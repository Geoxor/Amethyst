<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import {NextIcon, PauseIcon, PlayIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon, FileIcon, BitrateIcon } from "@/icons/plumpy";
import { LoopMode } from "@/logic/player";
import { onMounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import { getThemeColorHex } from "@/logic/color";
import { Track } from "@/logic/track";
import BaseChip from "@/components/BaseChip.vue";

const state = useState();
const player = usePlayer();
let wavesurfer: WaveSurfer;
const createWaveSurfer = () => {
  return WaveSurfer.create({
    container: "#waveform",
    barWidth: 1,
    responsive: true,
    waveColor: getThemeColorHex("--surface-400"),
    progressColor: getThemeColorHex("--primary-800"),
    height: 32,
    hideScrollbar: true,
    cursorWidth: 0,
  });
};

onMounted(() => {
  wavesurfer = createWaveSurfer();
  let oldTrack: Track;
  player.on("play", track => {
    if (track == oldTrack) {
      wavesurfer.play();
      return;
    };
    wavesurfer.load(track.path);
    wavesurfer.on("ready", () => {
      wavesurfer.play();
      wavesurfer.setVolume(0);
      wavesurfer.on("seek", value => player.seekTo(wavesurfer.getDuration() * value));
    });
    oldTrack = track;
  });

  player.on("pause", () => wavesurfer.pause());
});

const invoke = window.electron.ipcRenderer.invoke;
const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? player.volumeDown() : player.volumeUp();
};

// const handleSeekMouseScroll = (e: WheelEvent) => {
//   const delta = Math.sign(e.deltaY);
//   delta < 0 ? player.seekForward() : player.seekBackward();
// };

</script>

<template>
  <div class="flex gap-2 justify-between items-center h-full w-full">
    <cover
      v-if="state.settings.showCoverArt" 
      class="rounded-4px h-19 w-19"
      :url="player.getCurrentTrack()?.getCover() || state.state.defaultCover"
    />
    <div class="flex flex-col justify-between h-full w-full">
      <div class="flex flex py-1 gap-2 items-start justify-between">
        <div class="flex flex-col w-full py-1 font-bold gap-1 ">
          <h1
            class="text-12px hover:underline cursor-pointer"
            @click="invoke('show-item', [player.getCurrentTrack()?.path])"
          >
            {{ player.getCurrentTrack()?.getTitleFormatted() }}
          </h1>
          <p class="text-8px text-primary-900">
            {{ player.getCurrentTrack()?.getArtistsFormatted() }}
          </p>
        </div>
        
        <div class="flex flex-col gap-2 transform-gpu -translate-y-1 items-center">
          <div class="flex text-primary-800 gap-2">
            <!-- <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" /> -->
            <next-icon
              class="opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
              @click="player.previous()"
            />
            <pause-icon
              v-if="player.isPlaying.value"
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.pause()"
            />
            <play-icon
              v-else
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.play()"
            />
            <next-icon
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.next()"
            />
            <shuffle-icon
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.shuffle()"
            />
            <repeat-icon
              v-if="player.loopMode.value == LoopMode.None"
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.loopAll()"
            />
            <repeat-icon
              v-if="player.loopMode.value == LoopMode.All"
              class="opacity-100 text-gray-300 hover:text-white"
              @click="player.loopOne()"
            />
            <repeat-one-icon
              v-if="player.loopMode.value == LoopMode.One"
              class="opacity-100 text-gray-300 hover:text-white"
              @click="player.loopNone()"
            />
          </div>
          <p class="text-8px text-primary-900">
            {{ player.currentTimeFormatted(true) }} /
            {{ player.getCurrentTrack()?.getDurationFormatted(true) }}
          </p>
        </div>

        <div class="flex flex-col w-full gap-2 items-end">
          <slider
            id="volume"
            key="volume"
            v-model="player.volume.value"
            class="max-w-24"
            min="0"
            max="1"
            step="0.001"
            @input="player.setVolume(player.volume.value)"
            @wheel.passive="handleVolumeMouseScroll"
          />

          <div
            class="flex gap-1 text-8px font-bold"
          >
            <!-- <chip :icon="MetronomeIcon">
              128<strong class="opacity-50">bpm</strong>
            </chip>
            <chip :icon="KeyClefIcon">
              D# Pentatonic
            </chip> -->
            <base-chip
              v-if="player.getCurrentTrack()?.getMetadata()?.format.codec"
              :icon="FileIcon"
            >
              {{ player.getCurrentTrack()?.getMetadata()?.format.codec }}
            </base-chip>
            <base-chip
              v-if="player.getCurrentTrack()?.getMetadata()?.format.bitrate"
              :icon="BitrateIcon"
            >
              {{ ((player.getCurrentTrack()?.getMetadata()?.format.bitrate || 0) / 1000).toFixed(2) }}<strong
                class="opacity-50"
              >kbps</strong>
            </base-chip>
            <!-- <chip :icon="StorageIcon">
              {{(player.getFileSize())}}<strong class="opacity-50"> MB</strong>
            </chip> -->
          </div>
        </div>
      </div>
      <div
        id="waveform"
        class="w-full"
      />
    </div>
  </div>
</template>