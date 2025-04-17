<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import { useInspector } from "@/components/Inspector";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import LoudnessMeter from "@/components/visualizers/LoudnessMeter.vue";
import { SpectrumAnalyzer } from "@/components/visualizers/SpectrumAnalyzer";
import { AmethystIcon } from "@/icons";
import { router } from "@/router";
import { Icon } from "@iconify/vue";
import { LoadStatus } from "@shared/types";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";

const state = useState();

let lastVolumeBeforeMute = amethyst.player.volume.value;

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
  <div class="absolute bottom-4 flex justify-center px-4 gap-2 w-full left-1/2 transform-gpu -translate-x-1/2 z-10">
    <div
      v-if="state.settings.value.showLoudnessMeter"
      class="flex p-2 items-center h-16 gap-2 rounded-8px w-full min-w-120px max-w-240px text-black bg-playback-controls-background"
      @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
        { title: 'Hide', icon: AmethystIcon, action: () => state.settings.value.showLoudnessMeter = false },
      ]);"
    >
      <loudness-meter
        :key="amethyst.player.nodeManager.getNodeConnectinsString()"
        :node="amethyst.player.nodeManager.master.pre"
      />
    </div>
    <!-- Spacer to keep the middle dock centered  -->
    <div
      v-else
      class="w-0 lg:w-full max-w-240px"
    />

    <div
      class="flex relative items-center h-16 gap-2 p-2 rounded-8px min-w-540px w-full max-w-720px  text-black bg-playback-controls-background"
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
        v-if="state.settings.value.showDbMeter && state.settings.value.decibelMeterSeperatePrePost && amethyst.player.source"
        :key="amethyst.player.nodeManager.getNodeConnectinsString()"
        class="duration-user-defined cursor-pointer"
        :node="amethyst.player.nodeManager.master.pre"
        pre
        :channels="amethyst.player.getCurrentTrack()?.getChannels()"
        @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
          { title: 'Hide decibel meter', icon: AmethystIcon, action: () => state.settings.value.showDbMeter = false },
        ]);"
        @click="router.currentRoute.value.name === 'audio-monitor' ? router.back() : router.push({ name: 'audio-monitor' })"
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
      <Icon
        icon="ic:twotone-waves"
        class="utilityButton"
        :class="[
          state.settings.value.showLoudnessMeter && 'text-accent'
        ]"
        @click="state.settings.value.showLoudnessMeter = !state.settings.value.showLoudnessMeter"
      />
      <Icon
        icon="ic:twotone-graphic-eq"
        class="utilityButton"
        :class="[
          state.settings.value.showSpectrum && 'text-accent'
        ]"
        @click="state.settings.value.showSpectrum = !state.settings.value.showSpectrum"
      />
      <Icon
        v-if="amethyst.player.volume.value > 0"
        icon="ic:round-volume-up"
        class="utilityButton"
        @click="lastVolumeBeforeMute = amethyst.player.volume.value; amethyst.player.setVolume(0);"
      />
      <Icon
        v-else
        icon="ic:round-volume-off"
        class="utilityButton text-accent"
        @click="amethyst.player.setVolume(lastVolumeBeforeMute);"
      />
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
      <vectorscope
        v-if="state.settings.value.showVectorscope && amethyst.player.source"
        :key="amethyst.player.nodeManager.getNodeConnectinsString()"
        :node="amethyst.player.nodeManager.master.pre"
        :width="48"
        :height="48"
        @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
          { title: 'Hide Vectorscope', icon: AmethystIcon, action: () => state.settings.value.showVectorscope = false },
        ]);"
      />
    </div>
    <div
      v-if="state.settings.value.showSpectrum"
      class="flex overflow-hidden items-center h-16 gap-2 rounded-8px transition w-full min-w-80px max-w-240px text-black bg-playback-controls-background"
      @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
        { title: 'Hide', icon: AmethystIcon, action: () => state.settings.value.showSpectrum = false },
      ]);"
    >
      <SpectrumAnalyzer
        :key="amethyst.player.nodeManager.getNodeConnectinsString()"
        :node="amethyst.player.nodeManager.master.pre"
      />
    </div>
    <!-- Spacer to keep the middle dock centered  -->
    <div
      v-else
      class="w-0 lg:w-full max-w-240px"
    />
  </div>
</template>

<style scoped lang="postcss">

.utilityButton {
  @apply w-5 min-w-5 h-5 min-h-5 opacity-75 hover:opacity-100;
}

</style>