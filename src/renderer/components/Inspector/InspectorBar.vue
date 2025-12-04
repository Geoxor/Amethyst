<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, watch } from "vue";

import { useRoute } from "vue-router";
import { amethyst } from "@/amethyst.js";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import { AmethystAudioNode } from "@/logic/audio";
import { Track } from "@/logic/track";
import { AmethystOutputNode } from "@/nodes";

import BaseChip from "../BaseChip.vue";
import DraggableModifierInput from "../input/DraggableModifierInput.vue";
import QuickMenu from "../nodes/QuickMenu.vue";
import DropdownInput from "../v2/DropdownInput.vue";
import { useInspector } from ".";

import TrackInspector from "./TrackInspector.vue";

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

    <div
      v-if="inspector.state.currentItem instanceof AmethystAudioNode && inspector.state.currentItem"
      class="pb-32 h-full overflow-y-auto"
    >
      <section controls>
        <h1>
          <icon
            icon="ic:twotone-settings"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('node.controls') }}
        </h1>
        <quick-menu
          :node="inspector.state.currentItem"
        />
      </section>
      <section audio>
        <h1>
          <icon
            icon="ic:twotone-input"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('node.in_out') }}
        </h1>
        <span class="flex gap-2 h-32 justify-between items-center">
          <db-meter
            :key="inspector.state.currentItem.properties.id"
            pre
            :node="inspector.state.currentItem.pre"
            :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
          />
          <icon
            :icon="inspector.state.currentItem.properties.icon"
            class="h-12 w-12"
          />
          <db-meter
            v-if="!(inspector.state.currentItem instanceof AmethystOutputNode)"
            :key="inspector.state.currentItem.properties.id"
            post
            :node="inspector.state.currentItem.post"
            :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
          />
          <span v-else />
        </span>
      </section>

      <section
        v-if="Object.values(inspector.state.currentItem.getParameters()).length != 0"
        parameters
      >
        <h1>
          <icon
            icon="solar:volume-knob-broken"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('node.parameters') }}
        </h1>

        <div
          v-for="(value, key) in inspector.state.currentItem.getParameters()"
          :key="key"
          class="flex gap-2 items-center my-2 justify-between"
        >
          <h1>{{ key }}</h1>
          <draggable-modifier-input
            v-if="value.type == 'number'"
            v-model="inspector.state.currentItem[key]"
            :step="value.step"
            :max="value.max"
            :min="value.min"
            :suffix="value.unit"
            :default="value.default"
          />

          <dropdown-input
            v-else-if="value.type == 'string'"
            v-model="inspector.state.currentItem[key]"
            :options="value.options"
          />
        </div>
      </section>

      <section properties>
        <h1>
          <icon
            icon="ic:twotone-crop-16-9"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('node.properties') }}
        </h1>
        {{ inspector.state.currentItem.properties.name }}
        <h2 class="text-text-subtitle">
          {{ inspector.state.currentItem.properties.id }}
        </h2>
      </section>
    </div>

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
