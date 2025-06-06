<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useLocalStorage } from "@vueuse/core";
import { onMounted, onUnmounted, watch } from "vue";

import { amethyst } from "@/amethyst.js";
import LazyList from "@/components/LazyList.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
import SearchInput from "@/components/v2/SearchInput.vue";
import type { Track } from "@/logic/track";

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
  amethyst.player.on("player:trackChange", autoscroll);
});
onUnmounted(() => {
  amethyst.player.off("player:trackChange", autoscroll);
});
</script>

<template>
  <div
    class="py-2 pl-4 pr-2 flex  flex-col"
    :class="[amethyst.getCurrentPlatform() == 'mobile' ? 'px-2' : 'px-4']"
  >
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
  @apply truncate text-ellipsis;
}
</style>
