<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";

import LazyList from "@/components/LazyList.vue";
import { MyLocationIcon } from "@/icons/material";
import { ref, watch } from "vue";
import SquareButton from "@/components//input/SquareButton.vue";
import DroppableContainer from "@/components/DroppableContainer.vue";
import { Track } from "@/logic/track";
const player = usePlayer();
const state = useState();
const filterText = ref("");

const scrollToCurrentElement = (track?: Track) => {
  const active = document.querySelector(".vue-recycle-scroller");
  const currentTrack = track || player.getCurrentTrack();
  if (!currentTrack) return;

  const estimatedPosition = player.queue.search(filterText.value).indexOf(currentTrack) * 16;
  active?.scrollTo({ top: estimatedPosition, behavior: "smooth" });
};

watch(() => state.settings.followQueue, isEnabled => {
  if (isEnabled) {
    scrollToCurrentElement();
    player.on("play", scrollToCurrentElement);
  } else {
    player.off("play", scrollToCurrentElement);
  }
});

</script>

<template>
  <droppable-container class="flex-col p-1.5 flex w-full relative borderRight h-full">
    <input
      v-model="filterText"
      type="text"
      class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
      placeholder="name, album & artist..."
      @keydown.stop
    >

    <square-button
      class="absolute bottom-2 right-4.5 z-10 "
      :icon="MyLocationIcon"
      :active="state.settings.followQueue"
      @click="state.settings.followQueue = !state.settings.followQueue;"
    />

    <lazy-list :tracks="player.queue.search(filterText)" />
  </droppable-container>
</template>

<style lang="postcss" scoped>
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
