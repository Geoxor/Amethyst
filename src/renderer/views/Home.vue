<script setup lang="ts">
import type { IAudioMetadata } from "music-metadata";
import { computed, ref } from "vue";
import { usePlayer, useState } from "../amethyst";
import Queue from "../components/Queue.vue";
import Tag from "../components/Tag.vue";
import Spectrum from "../components/Spectrum.vue";
import PlayerControls from "../components/PlayerControls.vue";
import NavigationBar from "../components/NavigationBar.vue";
import NavigationButton from "../components/NavigationButton.vue";
import SettingsIcon from "../icons/Settings.vue";
import Settings from "../components/Settings.vue";
// import SmoothScrollableContainer from "../components/SmoothScrollableContainer.vue";
// import SocialBar from "../components/SocialBar.vue";

const invoke = window.electron.ipcRenderer.invoke;
const state = useState();
const player = usePlayer();
const metadata = computed(() => player.state.currentlyPlayingMetadata);

const isShowingSettings = ref(false);

const cover = computed(() => {
  if (!metadata.value?.common?.picture?.[0])
    return state.state.defaultCover;

  const buffer = metadata.value.common.picture[0].data;
  const blob = new Blob([buffer], { type: metadata.value.common.picture[0].format });
  return URL.createObjectURL(blob);
});

function calculateScore(metadata: IAudioMetadata) {
  const sampleRate = (metadata.format.sampleRate! / 1000);
  const bitRate = ~~(metadata.format.bitrate! / 1024);
  const bits = metadata.format.bitsPerSample || 16;
  const score = (sampleRate * bitRate * bits) / 100;

  return ~~score;
}

function calculateStars(metadata: IAudioMetadata) {
  let stars = 0;

  if (calculateScore(metadata) > 4000)
    stars++;
  if (metadata.format.lossless)
    stars++;
  if (metadata.format.bitsPerSample === 24)
    stars++;
  if (metadata.format.bitsPerSample === 32)
    stars++;

  return stars;
}
</script>

<template>
  <div class="flex  h-[calc(100%-24px)] text-white bg-[#0D0D0D] font-cozette main">
    <navigation-bar>
      <navigation-button :icon="SettingsIcon" :active="isShowingSettings" @click="isShowingSettings = !isShowingSettings" />
    </navigation-bar>
    <transition>
      <settings v-if="isShowingSettings"/>
    </transition>
    <queue />
    <div class="h-full flex w-full flex-col overflow-x-auto flex-1">
      <player-controls />

      <!-- <div class="flex bg-black w-full h-1/3" /> -->
      <!-- <div class="flex bg-gray-400 w-full h-1/3" /> -->
      <!-- <div class="flex bg-black w-full h-1/3" /> -->

      <div class="flex relative h-full  overflow-hidden">
        <!-- <div class="absolute w-full h-full bg-black transform scale-150 ">
        <div class="w-full h-full bg-center bg-no-repeat bg-cover opacity-50 filter blur-[64px]" :style="`background-image: url(${cover})`" />
      </div> -->

        <div class="z-10 p-8 flex w-full flex-col">
          <div class="flex gap-8 items-end">
            <img
              class="w-48 h-48 cover transform transition duration-201 active:-translate-y-0 hover:-translate-y-1 cursor-pointer"
              :src="cover">
            <div class="flex justify-between flex-col h-full gap-1">
              <div class="flex flex-col gap-2">
                <h1 class=" text-[32px] hover:underline cursor-external-pointer "
                  @click="invoke('show-item', [player.state.currentlyPlayingFilePath])">
                  {{ metadata?.common.title
                      ||
                      player.state.currentlyPlayingFilePath.substring(player.state.currentlyPlayingFilePath.lastIndexOf("\\")
                        + 1)
                  }}
                </h1>
                <h2 class=" text-black text-opacity-75 text-[16px] ">
                  {{ metadata?.common.artists?.join(" & ") }}
                </h2>
                <h1 v-if="metadata" class="whitespace-nowrap"
                  :class="calculateStars(metadata) > 0 && 'text-yellow-500'">
                  {{ '\u{0272e}'.repeat(calculateStars(metadata)) }} {{ calculateScore(metadata) }}pts
                </h1>
              </div>

              <div v-if="metadata" class="flex gap-2 items-center">
                <tag v-if="metadata.format.container" :text="metadata.format.container" />
                <tag v-if="metadata.format.bitrate" :text="`${~~(metadata.format.bitrate / 1024)}Kbps`" />
                <tag v-if="metadata.format.sampleRate" :text="`${(metadata.format.sampleRate / 1000)}KHz`" />
                <tag v-if="metadata.format.bitsPerSample" :text="`${metadata.format.bitsPerSample}bit`" />
                <tag v-if="metadata.format.numberOfChannels" :text="`${metadata.format.numberOfChannels}ch`" />
                <tag v-if="state.state.bpmCache[player.getCurrentlyPlayingFilePath()]"
                  :text="`${state.state.bpmCache[player.getCurrentlyPlayingFilePath()]}BPM`" />
              </div>
            </div>
          </div>
          <spectrum v-if="player.state.source" :key="player.state.currentlyPlayingFilePath" class="mt-8"
            :node="player.state.source" />
        </div>
      </div>
    </div>
    <!-- <social-bar /> -->
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}

.v-enter-active,
.v-leave-active {
  transition: 300ms ease;
  @apply w-64;
}

.v-enter-from,
.v-leave-to {
  @apply w-0;
}

.cover:hover {
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.25));
}
</style>
