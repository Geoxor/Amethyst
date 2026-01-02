<script setup lang="ts">
import { Icon } from "@iconify/vue";

import { amethyst } from "@/amethyst.js";

import TitleSubtitle from "./v2/TitleSubtitle.vue";

const props = defineProps<{ title?: string; description?: string; icon: any }>();

</script>

<template>
  <button
    class="duration-user-defined flex relative gap-4 bg-transparent text-text-title max-h-52px h-52px items-center py-2 px-4 rounded-8px"
  >
    <icon
      :icon="icon"
      class="w-5 h-5 min-w-5 min-h-5"
    />

    <title-subtitle
      v-if="!(amethyst.state.settings.appearance.minimalistMode && amethyst.state.settings.appearance.hideCategoryTitles) && title"
      :title="title"
      :subtitle="description"
    />
    <div
      v-if="amethyst.state.settings.appearance.neonMode"
      class="blurLayer w-full opacity-0 duration-user-defined z-0 bg-primary filter h-full absolute top-0 left-0 blur-16px"
    />
  </button>
</template>

<style scoped lang="postcss">

button {
  @apply border-transparent;
  &.neonMode {
    @apply border-solid border-2 py-1 px-4;
  }

  &:not(.neonMode):hover:not(.active) {
    @apply bg-primary/15 text-primary;

    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary/75;
    }
  }

  &:not(.neonMode).active {
    @apply bg-primary text-surface-700;

    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-surface-700;
    }
  }

  &.neonMode:hover {
    @apply text-primary/75;
    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary/100;
    }
  }

  &.neonMode.active {
    @apply border-solid border-2 border-primary text-primary;

    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary;
    }

    &:hover {
      @apply bg-primary/10;
    }

    .blurLayer {
      @apply opacity-25;
    }
  }

  &.isActive.neonMode > .blurLayer {
    @apply opacity-50;
  }

  &:hover > .blurLayer {
    @apply opacity-10;
  }
}

</style>
