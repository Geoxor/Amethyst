<script setup lang="ts">
import { amethyst } from "@/amethyst.js";

import LazyList from "@/components/LazyList.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import SearchInput from "@/components/v2/SearchInput.vue";
import type { Track } from "@/logic/track";
import { useLocalStorage } from "@vueuse/core";
import { onMounted, onUnmounted, watch } from "vue";

const filterText = useLocalStorage("filterText", "");

const scrollToCurrentElement = (track?: Track) => {
  const active = document.querySelector(".vue-recycle-scroller");
  const currentTrack = track || amethyst.player.getCurrentTrack();
  if (!currentTrack || !active) return;

  const estimatedPosition = amethyst.player.queue.search(filterText.value).indexOf(currentTrack) * 40;
  active.scrollTo({ top: estimatedPosition, behavior: "smooth" });
};

const autoscroll = () => amethyst.state.followQueue.value && scrollToCurrentElement();
watch(() => amethyst.state.followQueue.value, () => autoscroll());
onMounted(() => {
  amethyst.player.on("player:play", autoscroll);
});
onUnmounted(() => {
  amethyst.player.off("player:play", autoscroll);
});

</script>

<template>
  <div class="flex-col flex w-full py-1 gap-4 px-4 relative">
    <route-header :title="$t('route.queue')">
      <search-input v-model="filterText" />
    </route-header>
    
    <lazy-list />
  </div>
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
