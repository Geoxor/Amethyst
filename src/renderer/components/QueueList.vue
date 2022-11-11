<script setup lang="ts">
import { usePlayer } from "@/amethyst";

import LazyList from "@/components/LazyList.vue";
import MyLocationIcon from "@/icons/material/MyLocationIcon.vue";
import { ref } from "vue";
import SquareButton from "./input/SquareButton.vue";
const player = usePlayer();

const filterText = ref("");

const scrollToCurrentElement = () => {
  const active = document.querySelector(".vue-recycle-scroller");
  const currentTrack = player.getCurrentTrack();
  if (!currentTrack) return;
  
  const estimatedPosition = player.queue.getList().indexOf(currentTrack) * 16;
  active?.scrollTo({top: estimatedPosition, behavior: "smooth"});
};

</script>

<template>
  <div class="flex-col p-2 flex w-full relative borderRight h-full ">
    <input
      v-model="filterText"
      type="text"
      class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
      placeholder="name, album & artist..."
      @keydown.stop
    >

    <square-button
      class="absolute bottom-2 right-5 z-10 "
      :icon="MyLocationIcon"
      @click="scrollToCurrentElement"
    />

    <LazyList
      :tracks="player.queue.search(filterText)"
    />
  </div>
</template>

<style lang="postcss" scoped>
.control-hover:hover {
  @apply underline;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

td {
  @apply overflow-hidden overflow-ellipsis;
}

</style>
