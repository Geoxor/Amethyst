<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, onUnmounted, watch } from "vue";

import { useRoute } from "vue-router";
import { amethyst } from "@/amethyst.js";
import { AmethystAudioNode } from "@/logic/audio";
import { Track } from "@/logic/track";

import BaseChip from "../BaseChip.vue";
import { useInspector } from ".";

import TrackInspector from "./TrackInspector.vue";
import NodeInspector from "./NodeInspector.vue";

const route = useRoute();

watch(route, () => {
  useInspector().hide();
});

const getInspectableItemType = (item: Track | AmethystAudioNode) => {
  if (item instanceof Track) return "inspector.inspecting_item_type.track";
  if (item instanceof AmethystAudioNode) return "inspector.inspecting_item_type.node";
  return "inspector.inspecting_item_type.unknown";
};

const inspector = useInspector();
const handlePlay = (track: Track) => {
  if (inspector.state.currentItem instanceof Track) {
    inspector.inspect(track);
  }
};

onMounted(() => {
  amethyst.player.on("player:trackChange", handlePlay);
  const currentTrack = amethyst.player.getCurrentTrack();
  if (!currentTrack) return;
  if (!inspector.state.currentItem) inspector.inspect(currentTrack);
});

onUnmounted(() => {
  amethyst.player.off("player:trackChange", handlePlay);
});

</script>

<template>
  <div
    class="inspector text-12px top-16 right-2 truncate min-w-72 w-72 rounded-4px z-20 text-primary-900 h-[calc(100%+40px)] bg-surface-1000"
  >
    <div class="h-10 pl-3 flex w-full  justify-between items-center ">
      <div class="flex gap-2 items-center text-inspector-color">
        <icon
          icon="mdi:flask"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        <h1 class="font-zen-dots text-13px">
          {{ $t('inspector.title') }}
        </h1>
        <base-chip
          color="inspector-color"
          :icon="inspector.state.currentItem instanceof Track ? 'ic:twotone-audio-file' : 'mdi:resistor-nodes' "
        >
          {{ $t(getInspectableItemType(inspector.state.currentItem as any as Track)) }}
        </base-chip>
      </div>
      <button
        class="p-3 cursor-pointer hover:text-text-title"
        @click="inspector.hide()"
      >
        <icon
          icon="ic:twotone-close"
          class="utilityButton cursor-pointer"
        />
      </button>
    </div>

    <node-inspector
      v-if="inspector.state.currentItem instanceof AmethystAudioNode && inspector.state.currentItem"
      :node="inspector.state.currentItem"
    />

    <track-inspector
      v-if="inspector.state.currentItem instanceof Track && inspector.state.currentItem"
      :track="inspector.state.currentItem"
    />
  </div>
</template>

<style lang="postcss">
.inspector {
  @apply text-text-title text-12px pt-44px transform-gpu -translate-y-40px rounded-tl-16px;
}

section {
  @apply flex flex-col gap-1 p-3 ;
  /* border */
  @apply border-b-1 border-b-surface-600 border-t-transparent border-r-transparent border-l-transparent;

  & li {
    @apply flex justify-between gap-2 items-center w-full ;
  }

  & h1 {
    @apply text-text-subtitle text-13px font-normal ;
  }

  & > h1 {
    @apply text-accent ;
  }

  & > h1,
  & > h2 {
    @apply pb-2 flex gap-2 items-center whitespace-pre ;
  }

  & input,
  & p {
    @apply px-2 py-1 bg-surface-800 rounded-4px truncate text-ellipsis;
  }

  input {
    @apply border-solid border-1 border-transparent w-1/2;
    &:hover {
      @apply bg-accent/25 text-text-title;
    }
    &:focus {
      @apply bg-accent/25 border-solid border-1 border-accent text-text-title;
    }
  }
}

</style>
