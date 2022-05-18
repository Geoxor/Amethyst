<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useState } from "../../renderer/main";
const state = useState();
const sound = ref<HTMLAudioElement>();
const volume = computed(() => sound.value?.volume);
const duration = computed(() => sound.value?.duration);
onMounted(() => {
	sound.value = new Audio(state.openedFile);
	sound.value.play();
});
</script>

<template>
  <div v-if="sound">
    Opened File: {{ state.openedFile }}
    <br>
    Volume: <input v-model="sound.volume" min="0" max="1" step="0.01" type="range"> {{ volume }}
    Seek: <input v-model="sound.currentTime" min="0" :max="duration" step="0.01" type="range">
    <br>
    <button @click="sound!.play()">
      play
    </button>
    <br>
    <button @click="sound!.pause()">
      pause
    </button>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
</style>
