<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import TopBar from "@/components/TopBar.vue";

import ContextMenu from "@/components/input/ContextMenu.vue";
import SettingsBar from "@/components/SettingsBar.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import Spectrum from "@/components/visualizers/SpectrumAnalyzer.vue";

import NavigationBar from "@/components/NavigationBar.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";
import CoverArt from "@/components/CoverArt.vue";

import HideIcon from "@/icons/plumpy/HideIcon.vue";

const state = useState();
const player = usePlayer();
</script>

<template>
  <div class="flex fixed flex-col bg-surface-900">
    <cover-art 
      v-if="state.settings.showAmbientBackground"
      class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
      :style="`
        opacity: ${state.settings.ambientBackgroundOpacity}%;
        filter: blur(${state.settings.abmientBackgroundBlurStrength}px);
      `"
      :url="player.getCurrentTrack()?.getCover()"
    />

    <top-bar />
    <context-menu v-if="state.state.contextMenu.isVisible" />
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full overflow-hidden">
        <navigation-bar />
        <router-view />
        <settings-bar v-if="state.settings.showSettings" />
      </div>

      <div class="flex gap-2 p-2 bg-surface-800 borderTop">
        <vectorscope
          v-if="state.settings.showVectorscope && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide Vectorscope', icon: HideIcon, action: () => state.settings.showVectorscope = false },
          ]);"
        />

        <spectrum
          v-if="state.settings.showSpectrum && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide Spectrum', icon: HideIcon, action: () => state.settings.showSpectrum = false },
          ]);"
        />

        <db-meter
          v-if="state.settings.showDbMeter && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
          :channels="player.getCurrentTrack()?.getChannels() || 2"
          @contextmenu="state.openContextMenuAt($event.x, $event.y, [
            { title: 'Hide dB Meter', icon: HideIcon, action: () => state.settings.showDbMeter = false },
          ]);"
        />

        <playback-buttons :player="player" />
      </div>
    </div>
  </div>
</template> 
