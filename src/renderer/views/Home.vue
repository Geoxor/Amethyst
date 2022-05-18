<script setup lang="ts">
import { onMounted } from "vue";
import { useState } from "../../renderer/main";
const state = useState();
onMounted(() => {
	const sound = new Audio(state.openedFile);
	sound.play();
});
</script>

<template>
  <h1>
    Hello
    Opened File: {{ state.openedFile }}
  </h1>
</template>

<style lang="postcss" scoped>
a {
  @apply text-[#42b983];
}
</style>
