<script setup lang="ts">
import { useState, amethyst } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import {NextIcon, PauseIcon, PlayIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon } from "@/icons/plumpy";
import { LoopMode } from "@/logic/player";
import { onMounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import { getThemeColorHex } from "@/logic/color";
import { Track } from "@/logic/track";
import { useInspector } from "./Inspector";
import { BinocularsIcon, ExternalLinkIcon, HideIcon } from "@/icons/material";
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

  // Fix waveform not resizing when disabling/enabling meters
  const resizeObserver = new ResizeObserver(() => wavesurfer.setHeight(wavesurfer.getHeight()));
  resizeObserver.observe(document.getElementById("waveform")!);

  let oldTrack: Track;
  let hasSeekFiredOnce = true;
  amethyst.player.on("play", track => {
    // Don't regenerate the waveform if we are playing again from a pause
    if (track == oldTrack) {
      wavesurfer.play();
      return;
    };

    wavesurfer.load(track.path);
    wavesurfer.on("ready", () => {
      // Check if they paused before the waveform loaded
      if (amethyst.player.isPaused.value) return;
      wavesurfer.play();
      wavesurfer.setVolume(0);

      // Fix seek being off type on lowend pcs cus the waveform took too long to render
      // and we are already 7 seconds in lol
      if (track.isLoaded) {
        hasSeekFiredOnce = false;
        wavesurfer.seekTo(amethyst.player.currentTime.value / track.getDurationSeconds());
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
    amethyst.player.seekTo(wavesurfer.getDuration() * value);
  });

  amethyst.player.on("pause", () => {
    wavesurfer.pause();
  });

  amethyst.player.on("timeupdate", newTime => {
    // prevent an endless loop of seekTo's
    hasSeekFiredOnce = false;
    wavesurfer.seekTo(newTime / amethyst.player.getCurrentTrack()!.getDurationSeconds()); 
  });
});

const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? amethyst.player.volumeDown() : amethyst.player.volumeUp();
};

const handleContextCoverMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Inspect", icon: BinocularsIcon, action: () => amethyst.player.getCurrentTrack() && useInspector().inspectAndShow(amethyst.player.getCurrentTrack()!) },
    { title: "Export cover...", icon: ExternalLinkIcon, action: () => amethyst.player.getCurrentTrack()?.exportCover() },
    state.state.isShowingBigCover 
      ? { title: "Hide cover", icon: HideIcon, action: () => state.state.isShowingBigCover = false }
      : { title: "View cover", icon: ExternalLinkIcon, action: () => state.state.isShowingBigCover = true },
  ]);
};

// const handleSeekMouseScroll = (e: WheelEvent) => {
//   const delta = Math.sign(e.deltaY);
//   delta < 0 ? amethyst.player.seekForward() : amethyst.player.seekBackward();
// };

</script>

<template>
  <div class="flex gap-2 justify-between items-center h-full w-full">
    <cover
      v-if="state.settings.value.showCoverArt" 
      class="rounded-4px h-19 w-19 min-h-19 min-w-19 text-primary-900 border-1 border-transparent cursor-pointer hover:border-primary-800"
      :class="[
        state.state.isShowingBigCover && 'border-primary-700'
      ]"
      :url="amethyst.player.getCurrentTrack()?.getCover()"
      @contextmenu="handleContextCoverMenu"
      @click="state.state.isShowingBigCover = !state.state.isShowingBigCover"
    />
    <div class="flex flex-col justify-between h-full w-full">
      <div class="flex flex py-1 gap-2 items-start justify-between">
        <div class="flex flex-col w-full py-1 font-bold gap-1 ">
          <h1
            class="text-12px hover:underline cursor-pointer w-24 overflow-hidden overflow-ellipsis"
            @click=" amethyst.showItem(amethyst.player.getCurrentTrack()?.path!)"
          >
            {{ amethyst.player.getCurrentTrack()?.getTitleFormatted() }}
          </h1>
          <p class="text-8px text-primary-900">
            {{ amethyst.player.getCurrentTrack()?.getArtistsFormatted() }}
          </p>
        </div>
        
        <div class="flex flex-col gap-2 transform-gpu -translate-y-1 items-center">
          <div class="flex text-primary-800 gap-2">
            <!-- <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" /> -->
            <shuffle-icon
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="amethyst.player.shuffle()"
            />
            <next-icon
              class="opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
              @click="amethyst.player.previous()"
            />
            <pause-icon
              v-if="amethyst.player.isPlaying.value"
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="amethyst.player.pause()"
            />
            <play-icon
              v-else
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="amethyst.player.play()"
            />
            <next-icon
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="amethyst.player.skip()"
            />
            <repeat-icon
              v-if="amethyst.player.loopMode.value == LoopMode.None"
              class="opacity-75 hover:opacity-100 hover:text-white"
              @click="amethyst.player.loopAll()"
            />
            <repeat-icon
              v-if="amethyst.player.loopMode.value == LoopMode.All"
              class="opacity-100 text-gray-300 hover:text-white"
              @click="amethyst.player.loopOne()"
            />
            <repeat-one-icon
              v-if="amethyst.player.loopMode.value == LoopMode.One"
              class="opacity-100 text-gray-300 hover:text-white"
              @click="amethyst.player.loopNone()"
            />
          </div>
          <p class="text-8px text-primary-900">
            {{ amethyst.player.currentTimeFormatted(true) }} /
            {{ amethyst.player.getCurrentTrack()?.getDurationFormatted(true) }}
          </p>
        </div>

        <div class="flex flex-col w-full gap-2 items-end">
          <slider
            id="volume"
            key="volume"
            v-model="amethyst.player.volume.value"
            class="max-w-24"
            min="0"
            max="1"
            step="0.001"
            @input="amethyst.player.setVolume(amethyst.player.volume.value)"
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