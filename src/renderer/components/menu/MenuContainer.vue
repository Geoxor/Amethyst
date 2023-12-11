<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import TitleText from "../v2/TitleText.vue";
defineProps<{
  title: string
}>();
const isShowing = ref(false);
onKeyStroke("Escape", () => (isShowing.value = false));
import { useState } from "@/amethyst";
const state = useState();

</script>

<template>
  <div class="menu relative h-full no-drag ">
    <div
      :class="isShowing && 'text-primary-700 bg-surface-600'"
      class="hover:text-primary-800 hover:bg-surface-700 cursor-default flex  rounded-b-8px items-center mt-0.25 px-3 h-full duration-user-defined " 
      @click.stop="isShowing = !isShowing"
    >
      <title-text
        :text="title"
      />
    </div>
    <div
      v-if="isShowing"
      class="absolute z-30 flex select-none items-center bg-surface-800 shadow-xl rounded-6px left-0 mt-1 p-1 flex-col w-96"
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
