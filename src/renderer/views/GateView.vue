<script setup lang="ts">
import AmethystLogo from "@/icons/AmethystLogo.vue";
import { ref } from "vue";
const clicked = ref(false);
</script>

<template>
  <div class="w-full h-full bg-[#0f1119] absolute top-0 left-0 flex flex-col gap-2 items-center justify-center">
    <AmethystLogo
      class="w-48 h-48  hover:scale-105 transform-gpu animate-none duration-500 cursor-pointer active:scale-95" 
      :class="clicked && 'animate-spin w-0 h-0'"
      @click="clicked = true; $router.push({name: 'queue'});"
    />
  </div>
</template>
