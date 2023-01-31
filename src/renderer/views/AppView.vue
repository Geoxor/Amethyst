<script setup lang="ts">
import "@/amethyst";

import { useState } from "@/amethyst";
import TopBar from "@/components/TopBar.vue";
import {InspectorBar, useInspector} from "@/components/Inspector";
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
import { CloseIcon } from "@/icons/fluency";
import NavigationButton from "@/components/NavigationButton.vue";
import { ListIcon, SettingsIcon, SelectNoneIcon, PlaystationButtonsIcon, BinocularsIcon } from "@/icons/material";
import LoudnessMeter from "@/components/visualizers/LoudnessMeter.vue";

const state = useState();
const ambientBackgroundImage = ref("");

const setAmbientCover = async (track: Track) => {
  !(track.file instanceof File) && (ambientBackgroundImage.value = URL.createObjectURL(await track.getCoverAsBlob()));
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
      class="absolute select-none rounded-8px h-3/4 overflow-hidden top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <cover-art 
        v-if="state.state.isShowingBigCover"
        :url="ambientBackgroundImage"
        class="h-full"
        @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
          { title: 'Export cover...', icon: ExternalLinkIcon, action: () => player.getCurrentTrack()?.exportCover() },
        ]);"
      />

      <button
        class="p-3 absolute top-1 right-1 cursor-pointer hover:text-white"
        @click="state.state.isShowingBigCover = false"
      >
        <CloseIcon class="w-4 h-4" />
      </button>
    </div>

    <div
      v-if="state.settings.showAmbientBackground"
      :style="`
        transform: translate(-50%, -50%) scale(${state.settings.ambientBackgroundZoom}%);
        mix-blend-mode: ${state.settings.ambientBackgroundBlendMode};
      `"
      class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
    >
      <cover-art 
        class="w-full h-full" 
        :class="[
          state.settings.ambientBackgroundSpin && 'animate-spin'
        ]" 
        :style="`
        animation-duration: ${state.settings.ambientBackgroundSpinSpeed}s;
        opacity: ${state.settings.ambientBackgroundOpacity}%;
        filter: blur(${state.settings.ambientBackgroundBlurStrength}px);
      `"
        :url="ambientBackgroundImage"
      />
    </div>
    <top-bar />
    <context-menu v-if="useContextMenu().state.isVisible" />
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full relative overflow-hidden">
        <navigation-bar>
          <navigation-button
            :icon="SelectNoneIcon"
            :active="$route.name == 'node-editor'"
            @click="$router.push({ name: 'node-editor' })"
          />

          <navigation-button
            :icon="ListIcon"
            :active="$route.name == 'queue'"
            @click="$router.push({ name: 'queue' })"
          />

          <!-- <navigation-button
      :icon="BookshelfIcon"
      :active="$route.name == 'library'"
      @click="$router.push({name: 'library'})"
    /> -->

          <navigation-button
            :icon="PlaystationButtonsIcon"
            :active="$route.name == 'playground'"
            @click="$router.push({ name: 'playground' })"
          />

          <div class="flex-1" />
          <navigation-button
            :icon="BinocularsIcon"
            :active="useInspector().state.isVisible"
            @click="useInspector().state.isVisible = !useInspector().state.isVisible"
          />

          <navigation-button
            :icon="SettingsIcon"
            :active="$route.name?.toString().startsWith('settings') || false"
      
            @click="$router.push({ name: 'settings' })"
          />
        </navigation-bar>
        <div class="flex flex-col w-full">
          <router-view class="overflow-hidden" />
          <div
            class="flex justify-end w-full gap-2"
            :class="[(state.settings.showBigSpectrum || state.settings.showBigVectorscope) && 'p-2']"
          >
            <div
              v-if="state.settings.showBigSpectrum && player.source"
              class="w-full relative"
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

            <div
              v-if="state.settings.showBigVectorscope && player.source"
              class="relative"
            >
              <button
                class="p-3 absolute z-10 top-1 right-3 cursor-pointer text-primary-1000 hover:text-white"
                @click="state.settings.showBigVectorscope = false"
              >
                <CloseIcon class="w-4 h-4" />
              </button>
              <Vectorscope
                :key="player.nodeManager.getNodeConnectinsString()"
                :width="256"
                :height="256"
                class="h-64 w-64 bg-surface-1000"
                :node="player.nodeManager.master.audioNode"
                @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
                  { title: 'Hide', icon: HideIcon, action: () => state.settings.showBigVectorscope = false },
                ]);"
              />
            </div>
          </div>
        </div>
        <inspector-bar v-if="useInspector().state.isVisible" />
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

        <loudness-meter 
          v-if="state.settings.showLoudnessMeter && player.source"
          :node="player.nodeManager.master.audioNode"
        />

        <playback-buttons :player="player" />
        <vectorscope
          v-if="state.settings.showVectorscope && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.audioNode"
          :width="76"
          :height="76"
          class="clickable"
          :class="[
            state.settings.showBigVectorscope && 'border-primary-700 bg-primary-700 bg-opacity-10 hover:bg-opacity-20'
          ]"
          @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
            { title: 'Hide Vectorscope', icon: HideIcon, action: () => state.settings.showVectorscope = false },
          ]);"
          @click="state.settings.showBigVectorscope = !state.settings.showBigVectorscope"
        />
        <SpectrumAnalyzer
          v-if="state.settings.showSpectrum && player.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          class="clickable h-76px w-152px min-h-76px min-w-152px "
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
