<script setup lang="ts">
// defineProps<{}>();
// defineEmits([]);

import { amethyst, useState } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import { useInspector } from "@/components/Inspector";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import { AmethystIcon, SpeakerIcon } from "@/icons";
import { router } from "@/router";
import { LoadStatus } from "@shared/types";

const state = useState();

const handleContextCoverMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Inspect", icon: AmethystIcon, action: () => amethyst.player.getCurrentTrack() && useInspector().inspectAndShow(amethyst.player.getCurrentTrack()!) },
    { title: "Export cover...", icon: AmethystIcon, action: () => amethyst.player.getCurrentTrack()?.exportCover() },
    state.state.isShowingBigCover 
      ? { title: "Hide cover", icon: AmethystIcon, action: () => state.state.isShowingBigCover = false }
      : { title: "View cover", icon: AmethystIcon, action: () => state.state.isShowingBigCover = true },
  ]);
};

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const fineTuneStep = 1;
  const normalTuneStep = 5;
  const bigTuneStep = 20;

  if (e.altKey)
    delta < 0 ? amethyst.player.seekForward(fineTuneStep) : amethyst.player.seekBackward(fineTuneStep);
  else if (e.shiftKey) 
    delta < 0 ? amethyst.player.seekForward(bigTuneStep) : amethyst.player.seekBackward(bigTuneStep);
  else
    delta < 0 ? amethyst.player.seekForward(normalTuneStep) : amethyst.player.seekBackward(normalTuneStep);
};

const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const fineTuneStep = 0.01;
  const normalTuneStep = 0.05;
  
  if (e.altKey)
    delta > 0 ? amethyst.player.volumeDown(fineTuneStep) : amethyst.player.volumeUp(fineTuneStep);
  else 
    delta > 0 ? amethyst.player.volumeDown(normalTuneStep) : amethyst.player.volumeUp(normalTuneStep);
};

</script>

<template>
  <div class="absolute bottom-4 left-1/2 transform-gpu -translate-x-1/2 z-10">
    <div
      class="flex relative items-center h-16 gap-2 p-2 rounded-8px min-w-720px text-black bg-playback-controls-background"
    >
      <slider
        id="seek"
        key="seek"
        v-model="amethyst.player.currentTime.value"
        class="w-full h-8 absolute -top-1.5 hover:-top-3 w-full left-0 -z-1"
        :max="amethyst.player.getCurrentTrack()?.getDurationSeconds()"
        @input="amethyst.player.seekTo(amethyst.player.currentTime.value)"
        @wheel.passive="handleSeekMouseScroll"
      />
      <db-meter
        v-if="state.settings.value.showDbMeter && amethyst.player.source"
        :key="amethyst.player.nodeManager.getNodeConnectinsString()"
        class="duration-user-defined cursor-pointer"
        :node="amethyst.player.nodeManager.master.post"
        post
        :channels="amethyst.player.getCurrentTrack()?.getChannels()"
        @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
          { title: 'Hide decibel meter', icon: AmethystIcon, action: () => state.settings.value.showDbMeter = false },
        ]);"
        @click="router.currentRoute.value.name === 'audio-monitor' ? router.back() : router.push({ name: 'audio-monitor' })"
      />
      <cover-art
        v-if="state.settings.value.showCoverArt"
        class="rounded-4px h-48px w-48px min-h-48px min-w-48px text-primary-900 border-1 border-transparent cursor-pointer hover:border-primary-800"
        :class="[
          state.state.isShowingBigCover && 'border-primary-700'
        ]"
        :url="amethyst.player.getCurrentTrack()?.getCover()"
        @contextmenu="handleContextCoverMenu"
        @click="amethyst.player.getCurrentTrack()?.cover.state === LoadStatus.Loaded && (state.state.isShowingBigCover = !state.state.isShowingBigCover)"
      />
      <playback-buttons
        :player="amethyst.player"
      />
      <speaker-icon />
      <slider
        id="volume"
        key="volume"
        v-model="amethyst.player.volume.value"
        class="w-32 h-1.5"
        min="0"
        max="1"
        step="0.001"
        @input="amethyst.player.setVolume(amethyst.player.volume.value)"
        @wheel.passive="handleVolumeMouseScroll"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>