<script setup lang="ts">
import type { IAudioMetadata } from "music-metadata";
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import DbMeter from "../../renderer/components/DbMeter.vue";
import { useState } from "../../renderer/main";
const state = useState();
const sound = ref() as Ref<HTMLAudioElement>;
const ctx = ref(new window.AudioContext()) as Ref<AudioContext>;
const source = ref() as Ref<MediaElementAudioSourceNode>;
const metadata = ref<IAudioMetadata>();
const cover = computed(() => {
	if (!metadata?.value?.common?.picture?.[0])
		return;

	const buffer = metadata.value.common.picture[0].data;
	const blob = new Blob([buffer], { type: metadata.value.common.picture[0].format });
	return URL.createObjectURL(blob);
});

const currentTime = ref(0);
const timer = ref();

function play() {
	sound.value.play();
	state.isPlaying = true;
}

function pause() {
	sound.value.pause();
	state.isPlaying = false;
}

function loadSound(path: string) {
	sound.value && pause();
	sound.value = new Audio(path);
	play();
	sound.value.onended = () => {
		play();
	};

	timer.value && clearInterval(timer.value);

	timer.value = setInterval(() => {
		console.log(sound.value.currentTime);
		currentTime.value = sound.value.currentTime;
	}, 10);

	// set the html title to the song name
	document.title = state.openedFile || "Amethyst";

	window.electron.ipcRenderer.invoke<IAudioMetadata>("get-metadata", [path]).then(
		(data) => {
			metadata.value = data;
		});

	source.value = ctx.value.createMediaElementSource(sound.value);
	source.value.connect(ctx.value.destination);
}

onMounted(() => {
	loadSound(state.openedFile);
	watch(() => state.openedFile, () => loadSound(state.openedFile));
});
</script>

<template>
  <div v-if="sound && metadata">
    <div class="flex p-1 gap-2 items-center">
      <button v-if="state.isPlaying" @click="pause()">
        Pause
      </button>
      <button v-else @click="play()">
        Play
      </button>
      {{ currentTime.toFixed() }}
      <input v-model="sound.currentTime" class="w-full" min="0" :max="metadata.format.duration" step="0.01" type="range">
      <input v-model="sound.volume" min="0" max="1" step="0.01" type="range">
      <DbMeter :key="state.openedFile" :node="source" />
    </div>

    <img class="w-64" :src="cover">
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
</style>
