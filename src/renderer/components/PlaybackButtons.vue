<script setup lang="ts">
import { useState } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import {NextIcon, PauseIcon, PlayIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon } from "@/icons/plumpy";
import { LoopMode } from "@/logic/player";
import { onMounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import { getThemeColorHex } from "@/logic/color";
import { Track } from "@/logic/track";
import { player } from "@/logic/player";
import { useInspector } from "./Inspector";
import { BinocularsIcon } from "@/icons/material";
import { useContextMenu } from "./ContextMenu";

const state = useState();
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
    normalize: true,
  });
};

onMounted(() => {
  wavesurfer = createWaveSurfer();
  let oldTrack: Track;
  let hasSeekFiredOnce = true;
  player.on("play", track => {
    // Don't regenerate the waveform if we are playing again from a pause
    if (track == oldTrack) {
      wavesurfer.play();
      return;
    };

    wavesurfer.load(track.path);
    wavesurfer.on("ready", () => {
      // Check if they paused before the waveform loaded
      if (player.isPaused.value) return;
      wavesurfer.play();
      wavesurfer.setVolume(0);

      // Fix seek being off type on lowend pcs cus the waveform took too long to render
      // and we are already 7 seconds in lol
      if (track.isLoaded) {
        hasSeekFiredOnce = false;
        wavesurfer.seekTo(player.currentTime.value / track.getDurationSeconds());
      }
    });
    
    oldTrack = track;
  });

  wavesurfer.on("seek", value => {
    // Fixes odd stutter when syncing seek
    if (!hasSeekFiredOnce) {
      hasSeekFiredOnce = true;
      return; 
    }
    player.seekTo(wavesurfer.getDuration() * value);
  });

  player.on("pause", () => {
    wavesurfer.pause();
  });

  player.on("timeupdate", (newTime) => {
    // prevent an endless loop of seekTo's
    hasSeekFiredOnce = false;

    wavesurfer.seekTo(newTime / player.getCurrentTrack()!.getDurationSeconds()); 
  });
});

const invoke = window.electron.ipcRenderer.invoke;
const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? player.volumeDown() : player.volumeUp();
};

const handleContextCoverMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Inspect", icon: BinocularsIcon, action: () => player.getCurrentTrack() && useInspector().inspectAndShow(player.getCurrentTrack()!) },
  ]);
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
      @contextmenu="handleContextCoverMenu"
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
            <shuffle-icon
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="player.shuffle()"
            />
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
              @click="player.skip()"
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
        </div>
      </div>
      <div
        id="waveform"
        class="w-full"
      />
    </div>
  </div>
</template>