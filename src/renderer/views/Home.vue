<script setup lang="ts">
import type { IAudioMetadata } from "music-metadata";
import { computed, onMounted, ref } from "vue";
import { usePlayer, useState } from "../amethyst";
import Explorer from "../components/Explorer.vue";
import Tag from "../components/Tag.vue";
// import Explorer from "../components/Explorer.vue";
import DbMeter from "../../renderer/components/Dbmeter.vue";
import Spectrum from "../components/spectrum.vue";

const timer = ref();

const invoke = window.electron.ipcRenderer.invoke;
const state = useState();
const player = usePlayer();
const metadata = computed(() => player.state.currentlyPlayingMetadata);

const cover = computed(() => {
	if (!metadata.value?.common?.picture?.[0])
		return state.state.defaultCover;

	const buffer = metadata.value.common.picture[0].data;
	const blob = new Blob([buffer], { type: metadata.value.common.picture[0].format });
	return URL.createObjectURL(blob);
});

const currentTime = ref("0");

const handleVolumeMouseScroll = (e: WheelEvent) => {
	const delta = Math.sign(e.deltaY);
	delta > 0 ? player.volumeDown() : player.volumeUp();
};

const handleSeekMouseScroll = (e: WheelEvent) => {
	const delta = Math.sign(e.deltaY);
	const step = metadata.value!.format.duration! / 10;
	delta < 0 ? player.seekForward(step) : player.seekBackward(step);
};

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

onMounted(() => {
	player.loadSoundAndPlay(player.state.currentlyPlayingFilePath);

  timer.value && clearInterval(timer.value);
  timer.value = setInterval(() => {
    currentTime.value = `${player.currentTimeFormatted()} / ${player.currentDurationFormatted()}`;
  }, 500);
});
</script>

<template>
  <div class="flex h-[calc(100%-24px)] text-explorer-text bg-explorer-background font-cozette main">
    <explorer />
    <div v-if="metadata" class="h-full flex w-full flex-col">
      <div class="flex p-1 gap-2 items-center ">
        <input v-model="player.state.sound.currentTime" class="w-full " min="0" :max="metadata.format.duration" step="0.01" type="range" @wheel="handleSeekMouseScroll">
        <h1 class=" whitespace-nowrap text-sm">
          {{ currentTime }}
        </h1>
        <button class="flex items-center text-xl hover:text-blue-300" @click="player.shuffle()">
          ⮀
        </button>
        <button class="flex items-center text-xl hover:text-blue-300" @click="player.previous()">
          {{ '\u{0F049}' }} <!--  -->
        </button>
        <button v-if="player.isPlaying()" class="flex items-center text-xl hover:text-blue-300" @click="player.pause()">
          ⏸
        </button>
        <button v-else class="flex items-center text-xl hover:text-blue-300" @click="player.play()">
          ⏵
        </button>
        <button class="flex items-center text-xl hover:text-blue-300" @click="player.next()">
          {{ '\u{0F050}' }} <!--  -->
        </button>
        <input
          id="volume" key="volume" v-model="player.state.volume" class="max-w-32" min="0" max="1" step="0.01" type="range" @input="player.setVolume(player.state.volume)" @wheel="handleVolumeMouseScroll"
        >
        <DbMeter :key="player.getCurrentlyPlayingFilePath()" :node="player.state.source!" />
      </div>

      <!-- <div class="flex bg-black w-full h-1/3" /> -->
      <!-- <div class="flex bg-gray-400 w-full h-1/3" /> -->
      <!-- <div class="flex bg-black w-full h-1/3" /> -->

      <div class="flex relative h-full  overflow-hidden">
        <!-- <div class="absolute w-full h-full bg-black transform scale-150 ">
        <div class="w-full h-full bg-center bg-no-repeat bg-cover opacity-50 filter blur-[64px]" :style="`background-image: url(${cover})`" />
      </div> -->

        <div class="z-10 p-8 flex w-full flex-col">
          <div class="flex gap-8 items-end">
            <img class="w-48 h-48 cover transform transition duration-201 active:-translate-y-0 hover:-translate-y-1 cursor-pointer" :src="cover">
            <div class="flex justify-between flex-col h-full gap-1">
              <div class="flex flex-col gap-2">
                <h1 class=" text-[32px] hover:underline cursor-external-pointer " @click="invoke('show-item', [player.state.currentlyPlayingFilePath])">
                  {{ metadata.common.title || player.state.currentlyPlayingFilePath.substring(player.state.currentlyPlayingFilePath.lastIndexOf("\\") + 1) }}
                </h1>
                <h2 class=" text-black text-opacity-75 text-[16px] ">
                  {{ metadata.common.artists?.join(" & ") }}
                </h2>
                <h1 v-if="metadata" class="whitespace-nowrap" :class="calculateStars(metadata) > 0 && 'text-yellow-500'">
                  {{ '\u{0272e}'.repeat(calculateStars(metadata)) }} {{ calculateScore(metadata) }}pts
                </h1>
              </div>

              <div class="flex gap-2 items-center">
                <tag v-if="metadata.format.container" :text="metadata.format.container" />
                <tag v-if="metadata.format.bitrate" :text="`${~~(metadata.format.bitrate / 1024)}Kbps`" />
                <tag v-if="metadata.format.sampleRate" :text="`${(metadata.format.sampleRate / 1000)}KHz`" />
                <tag v-if="metadata.format.bitsPerSample" :text="`${metadata.format.bitsPerSample}bit`" />
                <tag v-if="metadata.format.numberOfChannels" :text="`${metadata.format.numberOfChannels}ch`" />
                <tag v-if="state.state.bpmCache[player.getCurrentlyPlayingFilePath()]" :text="`${state.state.bpmCache[player.getCurrentlyPlayingFilePath()]}BPM`" />
              </div>
            </div>
          </div>
          <spectrum :key="player.state.currentlyPlayingFilePath" class="mt-8" :node="player.state.source!" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
.cover:hover {
	filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.25));
}
</style>
