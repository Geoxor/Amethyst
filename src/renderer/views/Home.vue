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
const volume = computed(() => sound.value.volume);
const metadata = ref<IAudioMetadata>();
const duration = computed(() => sound.value.duration);
const cover = computed(() => {
	if (!metadata?.value?.common?.picture?.[0])
		return;

	const buffer = metadata.value.common.picture[0].data;
	const blob = new Blob([buffer], { type: metadata.value.common.picture[0].format });
	return URL.createObjectURL(blob);
});

function loadSound(path: string) {
	sound.value && sound.value.pause();
	sound.value = new Audio(path);
	sound.value.play();
	sound.value.onended = () => {
		sound.value.play();
	};

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
  <div v-if="sound">
    Opened File: {{ state.openedFile }}
    <br>
    Volume: <input v-model="sound.volume" min="0" max="1" step="0.01" type="range"> {{ volume }}
    Seek: <input v-model="sound.currentTime" min="0" :max="duration" step="0.01" type="range">
    <br>
    <button @click="sound.play()">
      play
    </button>
    <br>
    <button @click="sound.pause()">
      pause
    </button>
    <img class="w-64" :src="cover">
    <DbMeter :key="state.openedFile" :node="source" />
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
</style>
