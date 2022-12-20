<script setup lang="ts">
import { useState } from "@/amethyst";
import TopBar from "@/components/TopBar.vue";
import {InspectorBar, useInspector} from "@/components/Inspector";
import SettingsBar from "@/components/SettingsBar.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";
import CoverArt from "@/components/CoverArt.vue";
import { ContextMenu, useContextMenu } from "@/components/ContextMenu";
import { ExternalLinkIcon, HideIcon } from "@/icons/material";
import {SpectrumAnalyzer} from "@/components/visualizers/SpectrumAnalyzer";
import { onMounted, onUnmounted, ref } from "vue";
import { Track } from "@/logic/track";
import { player } from "@/logic/player";
import { CloseIcon } from "./icons/fluency";

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
    <context-menu v-if="useContextMenu().state.isVisible" />
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full relative overflow-hidden">
        <navigation-bar />
        <div class="flex flex-col w-full">
          <router-view class="overflow-hidden" />
          <div
            v-if="state.settings.showBigSpectrum && player.source"
            class="p-2 pt-0 relative"
          >
            <button
              class="p-3 absolute z-10 top-1 right-3 cursor-pointer text-primary-1000 hover:text-white"
              @click="state.settings.showBigSpectrum = false"
            >
              <CloseIcon class="w-4 h-4" />
            </button>
            <SpectrumAnalyzer
              
              :key="player.nodeManager.getNodeConnectinsString()"
              class="h-64 min-h-64 w-full bg-surface-1000"
              :node="player.nodeManager.master.audioNode"
              @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
                { title: 'Hide', icon: HideIcon, action: () => state.settings.showBigSpectrum = false },
              ]);"
            />
          </div>
        </div>
        <inspector-bar v-if="useInspector().state.isVisible" />
        <settings-bar v-if="state.settings.showSettings" />
      </div>

      <div
        v-if="state.settings.showPlaybackControls"
        class="flex gap-2 items-center p-2 bg-surface-800 borderTop"
      >
        <db-meter
          v-if="state.settings.showDbMeter && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.audioNode"
          :channels="player.getCurrentTrack()?.getChannels() || 2"
          @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
            { title: 'Hide dB Meter', icon: HideIcon, action: () => state.settings.showDbMeter = false },
          ]);"
        />

        <vectorscope
          v-if="state.settings.showVectorscope && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.audioNode"
          @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
            { title: 'Hide Vectorscope', icon: HideIcon, action: () => state.settings.showVectorscope = false },
          ]);"
        />

        <playback-buttons :player="player" />
        <SpectrumAnalyzer
          v-if="state.settings.showSpectrum && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          class="h-76px w-152px min-h-76px min-w-152px cursor-pointer border-1 border-transparent hover:bg-primary-700 hover:bg-opacity-10"
          :class="[
            state.settings.showBigSpectrum && 'border-primary-700 bg-primary-700 bg-opacity-10 hover:bg-opacity-20'
          ]"
          :node="player.nodeManager.master.audioNode"
          @click="state.settings.showBigSpectrum = !state.settings.showBigSpectrum"
          @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
            { title: 'Hide Spectrum', icon: HideIcon, action: () => state.settings.showSpectrum = false },
            state.settings.showBigSpectrum 
              ? { title: 'Minimize', icon: ExternalLinkIcon, action: () => state.settings.showBigSpectrum = false }
              : { title: 'Expand', icon: ExternalLinkIcon, action: () => state.settings.showBigSpectrum = true },
          ]);"
        />
      </div>
    </div>
  </div>
</template> 

<style lang="postcss">
@import url(themes/amethyst-dark.css);
/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';

@font-face {
  font-family: "jost";
  src: url("../../assets/fonts/jost.ttf");
}

@font-face {
  font-family: "aseprite";
  src: url("../../assets/fonts/aseprite-remix.ttf");
}

* {
  cursor: url("./cursors/default.png"), auto;
  font-family: "jost";
}

*.font-aseprite {
  font-family: "aseprite";
  @apply text-7px;
}

*.font-aseprite * {
  font-family: "aseprite";
}

.cursor-pointer,
.cursor-pointer * {
  cursor: url("./cursors/pointer.png") 4 0, auto !important;
}

.cursor-heart-pointer,
.cursor-heart-pointer * {
  cursor: url("./cursors/heart-pointer.png") 4 0, auto !important;
}

.cursor-external-pointer,
.cursor-external-pointer * {
  cursor: url("./cursors/external-pointer.png") 4 0, auto !important;
}

.not-allowed,
.not-allowed * {
  cursor: not-allowed !important;
}

* {
  @apply !outline-none;
  cursor: url("./cursors/default.png"), auto !important;
}

/*  Fixes the white bg showing up when resizing */
html,
body,
#app,
#app {
  @apply bg-surface-900;
}

html,
body,
#app,
#app>div {
  @apply h-full w-full;
}

*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

*:hover::-webkit-scrollbar {
  overflow-y: overlay;
}

*::-webkit-scrollbar-track,
*::-webkit-scrollbar-corner {
  border-radius: 20px;
  @apply bg-surface-700;
}

*::-webkit-scrollbar-thumb {
  border-radius: 20px;
  @apply bg-surface-500;
  border: transparent;
}

.borderRight {
  @apply border-r-1 border-r-surface-600 border-t-transparent border-b-transparent border-l-transparent;
}

.borderLeft {
  @apply border-l-1 border-l-surface-600 border-t-transparent border-b-transparent border-r-transparent;
}

.borderBottom {
  @apply border-b-1 border-b-surface-600 border-t-transparent border-r-transparent border-l-transparent;
}

.borderTop {
  @apply border-t-1 border-b-transparent border-t-surface-600 border-r-transparent border-l-transparent;
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}

</style>