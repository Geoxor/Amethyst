<script setup lang="ts">
import { useState, amethyst } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import {NextIcon, PauseIcon, PlayIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon } from "@/icons/plumpy";
import { LoopMode } from "@/logic/player";
import { onMounted } from "vue";
import { useInspector } from "./Inspector";
import { BinocularsIcon, ExternalLinkIcon, HideIcon } from "@/icons/material";
import { useContextMenu } from "./ContextMenu";

const state = useState();

onMounted(() => {

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

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta < 0 ? amethyst.player.seekForward() : amethyst.player.seekBackward();
};

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
    
    <div class="flex flex-col justify-between h-full w-full ">
      <div
        :class="[amethyst.getCurrentPlatform() === 'mobile' ? 'rounded-full ' : 'rounded-4px']"
        class="flex flex-col gap-2 transform-gpu bg-surface-700 p-2 px-4 -translate-y-1 items-center filter drop-shadow-lg absolute  -top-10 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2"
      >
        <div class="flex text-primary-800 gap-2 ">
          <!-- <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" /> -->
          <shuffle-icon
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white"
            @click="amethyst.player.shuffle()"
          />
          <next-icon
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
            @click="amethyst.player.previous()"
          />
          <pause-icon
            v-if="amethyst.player.isPlaying.value"
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white"
            @click="amethyst.player.pause()"
          />
          <play-icon
            v-else
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white"
            @click="amethyst.player.play()"
          />
          <next-icon
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white"
            @click="amethyst.player.skip()"
          />
          <repeat-icon
            v-if="amethyst.player.loopMode.value == LoopMode.None"
            class="h-5 w-5 opacity-75 hover:opacity-100 hover:text-white"
            @click="amethyst.player.loopAll()"
          />
          <repeat-icon
            v-if="amethyst.player.loopMode.value == LoopMode.All"
            class="h-5 w-5 opacity-100 text-gray-300 hover:text-white"
            @click="amethyst.player.loopOne()"
          />
          <repeat-one-icon
            v-if="amethyst.player.loopMode.value == LoopMode.One"
            class="h-5 w-5 opacity-100 text-gray-300 hover:text-white"
            @click="amethyst.player.loopNone()"
          />
        </div>
      </div>

      <div class="flex justify-between disable-select no-drag">
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
        <div class="flex flex-col w-full max-w-24 mt-1 gap-2 items-end">
          <slider
            id="volume"
            key="volume"
            v-model="amethyst.player.volume.value"
            class="w-full"
            min="0"
            max="1"
            step="0.001"
            @input="amethyst.player.setVolume(amethyst.player.volume.value)"
            @wheel.passive="handleVolumeMouseScroll"
          />
        </div>
      </div>
      <div class="flex flex py-1 gap-2 items-start justify-between disable-select no-drag">
        <slider
          id="seek"
          key="seek"
          v-model="amethyst.player.currentTime.value"
          class="w-full h-4"
          :max="amethyst.player.getCurrentTrack()?.getDurationSeconds()"
          @input="amethyst.player.seekTo(amethyst.player.currentTime.value)"
          @wheel.passive="handleSeekMouseScroll"
        />
        <p class="text-8px text-primary-900">
          {{ amethyst.player.currentTimeFormatted(true) }} /
          {{ amethyst.player.getCurrentTrack()?.getDurationFormatted(true) }}
        </p>
      </div>
    </div>
  </div>
</template>