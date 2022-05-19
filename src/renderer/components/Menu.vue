<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
defineProps<{
	title: string
}>();
const isShowing = ref(false);
onKeyStroke("Escape", () => (isShowing.value = false));
</script>

<template>
  <div class="menu relative h-full no-drag">
    <div class="hover:text-blue-400 cursor-default  px-2 h-full" @click.stop="isShowing = !isShowing">
      {{ title }}
    </div>
    <div v-if="isShowing" class="absolute z-20 flex items-center bg-gray-700 text-white py-2 flex-col w-72" @click="isShowing = false">
      <slot />
    </div>
  </div>
  <div
    :class="isShowing && 'pointer-events-auto'"
    class="pointer-events-none z-10 opacity-50 absolute  w-full h-full"
    @click="isShowing = false"
  />
</template>
