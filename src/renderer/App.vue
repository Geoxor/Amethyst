<script setup lang="ts">
import { useState } from "@/amethyst";
import TopBar from "@/components/TopBar.vue";

import ContextMenu from "@/components/input/ContextMenu.vue";
import SettingsBar from "@/components/SettingsBar.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";
import CoverArt from "@/components/CoverArt.vue";

import {HideIcon} from "@/icons/plumpy";
import GPUSpectrumAnalyzer from "@/components/visualizers/GPUSpectrumAnalyzer.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { Track } from "@/logic/track";
import { player } from "@/logic/player";

const state = useState();
const ambientBackgroundImage = ref("");

const setAmbientCover = async (track: Track) => {
  const cover = (await track.fetchMetadata(true))?.common.picture?.[0];
  cover && (ambientBackgroundImage.value = URL.createObjectURL(new Blob([new Uint8Array(cover.data)], { type: "image/png" })));
};

onMounted(() => {
  player.on("play", setAmbientCover);
});

onUnmounted(() => {
  player.off("play", setAmbientCover);
});

</script>

<template>
  <div class="flex fixed flex-col bg-surface-900">
    <div
      v-if="state.settings.showAmbientBackground"
      :style="`
        transform: translate(-50%, -50%) scale(${state.settings.ambientBackgroundZoom}%);
      `"
      class="absolute z-1000 select-none mix-blend-soft-light pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
    >
      <cover-art 
        class="w-full h-full" 
        :class="[
          state.settings.ambientBackgroundSpin && 'animate-spin'
        ]" 
        :style="`
        animation-duration: ${state.settings.ambientBackgroundSpinSpeed}s;
        opacity: ${state.settings.ambientBackgroundOpacity}%;
        filter: blur(${state.settings.abmientBackgroundBlurStrength}px);
      `"
        :url="ambientBackgroundImage"
      />
    </div>
    <top-bar />
    <context-menu v-if="state.state.contextMenu.isVisible" />
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full overflow-hidden">
        <navigation-bar />
        <router-view />
        <settings-bar v-if="state.settings.showSettings" />
      </div>

      <div class="flex gap-2 items-center p-2 bg-surface-800 borderTop">
        <db-meter
          v-if="state.settings.showDbMeter && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.audioNode"
          :channels="player.getCurrentTrack()?.getChannels() || 2"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide dB Meter', icon: HideIcon, action: () => state.settings.showDbMeter = false },
          ]);"
        />

        <vectorscope
          v-if="state.settings.showVectorscope && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.audioNode"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide Vectorscope', icon: HideIcon, action: () => state.settings.showVectorscope = false },
          ]);"
        />

        <playback-buttons :player="player" />

        <GPUSpectrumAnalyzer
          v-if="state.settings.showSpectrum && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          class="h-76px w-152px min-h-76px min-w-152px"
          :node="player.nodeManager.master.audioNode"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide Spectrum', icon: HideIcon, action: () => state.settings.showSpectrum = false },
          ]);"
        />
      </div>
    </div>
  </div>
</template> 
