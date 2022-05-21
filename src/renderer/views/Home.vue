<script setup lang="ts">
import type { IAudioMetadata } from "music-metadata";
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import Explorer from "../components/Explorer.vue";
import Tag from "../components/Tag.vue";
// import Explorer from "../components/Explorer.vue";
import DbMeter from "../../renderer/components/DbMeter.vue";
import { defaultCover, useState } from "../../renderer/state";
import Spectrum from "../components/Spectrum.vue";

const invoke = window.electron.ipcRenderer.invoke;
const state = useState();
const sound = ref() as Ref<HTMLAudioElement>;
const ctx = ref(new window.AudioContext()) as Ref<AudioContext>;
const source = ref() as Ref<MediaElementAudioSourceNode>;
const metadata = ref<IAudioMetadata>();

const cover = computed(() => {
	if (!metadata?.value?.common?.picture?.[0])
		return defaultCover.value;

	const buffer = metadata.value.common.picture[0].data;
	const blob = new Blob([buffer], { type: metadata.value.common.picture[0].format });
	return URL.createObjectURL(blob);
});

// Turns seconds from 80 to 1:20
const secondsHuman = (time: number) => {
	const seconds = Math.floor(time);
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds % 60;
	return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};

const currentTime = ref(0);
const timer = ref();
const richPresenceTimer = ref();

const handleVolumeMouseScroll = (e: WheelEvent) => {
	const delta = Math.sign(e.deltaY);
	delta > 0 ? sound.value.volume -= 0.1 : sound.value.volume += 0.1;
};

const handleSeekMouseScroll = (e: WheelEvent) => {
	const delta = Math.sign(e.deltaY);
	const step = metadata.value!.format.duration! / 10;
	delta < 0 ? sound.value.currentTime = currentTime.value + step : sound.value.currentTime = currentTime.value - step;
};

function play() {
	sound.value.play();
	state.isPlaying = true;
}

function pause() {
	sound.value.pause();
	state.isPlaying = false;
}

function next() {
  if ((state.currentlyPlaying + 1) < (state.queue.length - 1))
    state.currentlyPlaying++;
}

function previous() {
  if ((state.currentlyPlaying - 1) > 0)
    state.currentlyPlaying--;
}

const openFile = ref("");

watch(() => state.currentlyPlaying, () => {
  openFile.value = state.queue[state.currentlyPlaying];
  loadSound(openFile.value);
});

function loadSound(path: string) {
	sound.value && pause();
	sound.value = new Audio(path);
	sound.value.volume = state.volume;
	play();
	sound.value.onended = () => {
		next();
	};

  // This is the timer for the current duration ont he UI
  // because for some reason it doesnt wanna update on its own
	timer.value && clearInterval(timer.value);
	timer.value = setInterval(() => currentTime.value = sound.value.currentTime, 10);

  // Discord rich presence timer that updates discord every second
	richPresenceTimer.value && clearInterval(richPresenceTimer.value);
	richPresenceTimer.value = setInterval(() => {
		metadata.value && invoke("update-rich-presence", [
      metadata.value.common.albumartist ? `${metadata.value.common.albumartist!} - ${metadata.value.common.title}` : openFile.value.substring(openFile.value.lastIndexOf("\\") + 1),
      secondsHuman(metadata.value.format.duration!),
      secondsHuman(currentTime.value!),
      state.isPlaying.toString(),
		]);
	}, 1000);

	// set the html title to the song name
	document.title = openFile.value || "Amethyst";

	window.electron.ipcRenderer.invoke<IAudioMetadata>("get-metadata", [path]).then(
		(data) => {
			metadata.value = data;
		});

	source.value = ctx.value.createMediaElementSource(sound.value);
	source.value.connect(ctx.value.destination);
}

onMounted(() => {
	loadSound(openFile.value);
	watch(() => openFile.value, () => loadSound(openFile.value));
});
</script>

<template>
  <div class="flex h-full ">
    <explorer />
    <div v-if="sound && metadata" class="h-full flex w-full flex-col">
      <div class="flex p-1 gap-2 items-center">
        <input v-model="sound.currentTime" class="w-full " min="0" :max="metadata.format.duration" step="0.01" type="range" @wheel="handleSeekMouseScroll">

        <h1 class="font-cozette whitespace-nowrap text-sm">
          {{ secondsHuman(currentTime) }} / {{ secondsHuman(metadata.format.duration!) }}
        </h1>
        <button class="flex items-center" @click="previous()">
          <i-fluency-previous class="w-5 h-5" />
        </button>
        <button v-if="state.isPlaying" class="flex items-center" @click="pause()">
          <i-fluency-pause class="w-5 h-5" />
        </button>
        <button v-else class="flex items-center" @click="play()">
          <i-fluency-play class="w-5 h-5" />
        </button>
        <button class="flex items-center" @click="next()">
          <i-fluency-next class="w-5 h-5" />
        </button>
        <input
          id="volume" v-model="sound.volume" class="max-w-32" min="0" max="1" step="0.01" type="range" @input="state.volume = sound.volume" @wheel="handleVolumeMouseScroll"
        >
        <DbMeter :key="openFile" :node="source" />
      </div>

      <!-- <div class="flex bg-black w-full h-1/3" /> -->
      <!-- <div class="flex bg-gray-400 w-full h-1/3" /> -->
      <!-- <div class="flex bg-black w-full h-1/3" /> -->

      <div class="flex relative h-full bg-white overflow-hidden">
        <!-- <div class="absolute w-full h-full bg-black transform scale-150 ">
        <div class="w-full h-full bg-center bg-no-repeat bg-cover opacity-50 filter blur-[64px]" :style="`background-image: url(${cover})`" />
      </div> -->

        <div class="z-10 px-24 flex w-full flex-col justify-center">
          <div class="flex gap-8">
            <img class="w-48 h-48 cover" :src="cover">
            <div class="flex flex-col gap-2">
              <h1 class="font-cozette text-[32px] hover:underline cursor-pointer " @click="invoke('show-item', [openFile])">
                {{ metadata.common.title || openFile.substring(openFile.lastIndexOf("\\") + 1) }}
              </h1>
              <h2 class="font-cozette text-black text-opacity-75 text-[16px] ">
                {{ metadata.common.albumartist }}
              </h2>

              <div class="flex gap-2 items-center">
                <tag v-if="metadata.format.container" :text="metadata.format.container" />
                <tag v-if="metadata.format.bitrate" :text="`${~~(metadata.format.bitrate / 1024)}Kbps`" />
                <tag v-if="metadata.format.sampleRate" :text="`${(metadata.format.sampleRate / 1000)}KHz`" />
                <tag v-if="metadata.format.bitsPerSample" :text="`${metadata.format.bitsPerSample}bit`" />
                <tag v-if="metadata.format.numberOfChannels" :text="`${metadata.format.numberOfChannels}ch`" />
              </div>
            </div>
          </div>

          <spectrum :key="openFile" :node="source" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
.cover {
	filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.25));
}
</style>
