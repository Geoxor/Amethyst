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
    <div
      :class="isShowing && 'text-primary-700 bg-surface-700'"
      class="hover:text-primary-800 hover:bg-surface-700 cursor-default flex items-center mt-0.25 px-2 h-full"
      @click.stop="isShowing = !isShowing"
    >
      {{ title }}
    </div>
    <div
      v-if="isShowing"
      class="absolute z-30 flex select-none items-center bg-surface-800 shadow-xl border-1 border-surface-600 left-0 py-2 flex-col w-96"
      @click="isShowing = false"
    >
      <slot />
    </div>
  </div>
  <div
    v-if="isShowing"
    :class="isShowing && 'pointer-events-auto'"
    class="pointer-events-none z-20 top-0 left-0 absolute w-full h-full"
    @click="isShowing = false;"
  />
</template>
