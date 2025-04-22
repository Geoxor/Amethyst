<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import { ContextMenu, useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import { InspectorBar, useInspector } from "@/components/Inspector";
import NavigationBar from "@/components/NavigationBar.vue";
import NavigationButton from "@/components/NavigationButton.vue";
import TopBar from "@/components/TopBar.vue";
import PlaybackControls from "@/components/v2/PlaybackControls.vue";
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer/SpectrumAnalyzer.vue";
import { AmethystIcon } from "@/icons";
import { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { onMounted, onUnmounted, ref, watch } from "vue";

const state = useState();
const ambientBackgroundImage = ref("");

const setAmbientCover = async (track: Track) => {
  track.getCoverAsBlob().then(blob => ambientBackgroundImage.value = URL.createObjectURL(blob));
};

onMounted(() => {
  amethyst.player.on("play", setAmbientCover);
});

onUnmounted(() => {
  amethyst.player.off("play", setAmbientCover);
});

watch(() => state.settings.value.showBigSpectrum, () => {
  window.electron.ipcRenderer.invoke("fullscreen");
});

</script>

<template>
  <div
    v-if="state.settings.value.showBigSpectrum"
    class="absolute top-0 left-0 w-320px h-280px z-30 bg-surface-800 "
    @click="state.settings.value.showBigSpectrum = false"
  >
    <spectrum-analyzer
      key="big-spectrum-analyzer"
      :node="amethyst.player.nodeManager.master.pre"
    />
  </div>
  <div
    v-else
    class="flex fixed flex-col bg-surface-900"
  >
    <div
      v-if="state.state.isShowingBigCover"
      class="absolute select-none rounded-8px w-full sm:w-auto max-w-3/4 max-h-3/4 overflow-hidden top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 z-50"
      style="aspect-ratio: 1/1;"
    >
      <cover-art 
        :url="ambientBackgroundImage"
        class="w-full drop-shadow-2xl z-30"
        @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
          { title: 'Export cover...', icon: 'ic:twotone-add-photo-alternate', action: () => amethyst.player.getCurrentTrack()?.exportCover() },
        ]);"
        @click="state.state.isShowingBigCover = !state.state.isShowingBigCover"
      />

      <icon
        icon="ic:twotone-close"
        class="utilityButton absolute top-3 right-3 cursor-pointer"
        @click="state.state.isShowingBigCover = false"
      />
    </div>

    <div
      v-if="state.settings.value.showAmbientBackground && ambientBackgroundImage"
      :style="`
        transform: translate(-50%, -50%) scale(${state.settings.value.ambientBackgroundZoom}%);
        mix-blend-mode: ${state.settings.value.ambientBackgroundBlendMode};
      `"
      class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
    >
      <cover-art 
        class="w-full h-full" 
        :class="[
          state.settings.value.ambientBackgroundSpin && 'animate-spin'
        ]" 
        :style="`
        animation-play-state: ${state.settings.value.pauseVisualsWhenUnfocused && !state.state.isFocused ? 'paused' : 'running'};
        animation-duration: ${state.settings.value.ambientBackgroundSpinSpeed}s;
        opacity: ${state.settings.value.ambientBackgroundOpacity}%;
        filter: blur(${state.settings.value.ambientBackgroundBlurStrength}px);
      `"
        :url="ambientBackgroundImage"
      />
    </div>
    <div
      v-if="amethyst.getCurrentPlatform() === 'web'"
      class="h-6 bg-yellow-500 text-black items-center flex gap-1 justify-center select-none w-full text-12px"
    >
      Amethyst Web is heavily disfunctional due to 
      Chrome's security policies regarding filesystem access, for the best experience <a
        href="https://github.com/Geoxor/amethyst/releases/latest"
        target="_blank"
      > <strong
        class="duration-user-defined underline cursor-pointer hover:text-primary-800"
      >download the native app</strong> </a> 
    </div>
    <top-bar v-if="amethyst.getCurrentPlatform() === 'desktop'" />
    <context-menu v-if="useContextMenu().state.isVisible" />
    <div
      v-if="amethyst.getCurrentPlatform() === 'mobile'"
      class="w-full absolute bottom-0 z-10 "
    >
      <div
        class="p-2 rounded-t-24px overflow-hidden drop-shadow-2xl flex bg-surface-700 justify-between"
      > 
        <navigation-button
          :icon="AmethystIcon"
          route-name="queue"
          text="Queue"
          mobile
        />

        <navigation-button
          :icon="AmethystIcon"
          route-name="node-editor"
          text="Node Editor"
          mobile
        />

        <navigation-button
          :icon="AmethystIcon"
          route-name="settings"
          text="Settings"
          mobile
        />
      </div>
    </div>
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full relative overflow-hidden">
        <navigation-bar v-if="amethyst.getCurrentPlatform() !== 'mobile'" />

        <div class="flex flex-col w-full">
          <router-view class="overflow-hidden disable-select no-drag" />
        </div>
        <inspector-bar v-if="useInspector().state.isVisible" />
      </div>

      <playback-controls v-if="state.settings.value.showPlaybackControls" />
    </div>
  </div>
</template> 

<style lang="postcss">
@import url(themes/amethyst-dark.css);
@import url(themes/emerald-dark.css);
@import url(themes/onyx-dark.css);
@import url(themes/rose-dark.css);
@import url(themes/ruby-dark.css);
@import url(themes/sapphire-dark.css);

/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';

@font-face {
  font-family: "jost";
  src: url("../../assets/fonts/jost.ttf");
}

@font-face {
  font-family: "zen-dots";
  src: url("../../assets/fonts/zen-dots.ttf");
}

@font-face {
  font-family: "aseprite";
  src: url("../../assets/fonts/aseprite-remix.ttf");
}

* {
  cursor: url("./cursors/default.png"), auto;
  font-family: jost, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

*.font-aseprite {
  font-family: "aseprite";
  @apply text-7px;
}

*.font-zen-dots {
  font-family: "zen-dots";
  @apply text-20px;
}

*.font-aseprite * {
  font-family: "aseprite";
}

*.duration-user-defined {
  transition-duration: var(--transition-duration);
}

*.duration-meter-user-defined {
  transition-duration: var(--smoothing-duration);
}

*.font-weight-user-defined {
  font-weight: var(--font-weight);
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

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.clickable {
  @apply cursor-pointer border-1 border-transparent hover:bg-primary-700 hover:bg-opacity-10;
}

.disable-select {
  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;
}

</style>