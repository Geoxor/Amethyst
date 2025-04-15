<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { computed } from "vue";
import { useRoute } from "vue-router";
import TitleSubtitle from "./TitleSubtitle.vue";

import { Icon } from "@iconify/vue";

const route = useRoute();
const props = defineProps<{title: string, description?: string, icon: any, routeName: string}>();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);

</script>

<template>
  <button
    :class="[isActive && 'active', amethyst.store.settings.value.neonMode && 'neonMode']"
    class="duration-user-defined flex relative w-full gap-4 cursor-pointer bg-transparent text-text_title min-h-52px items-center py-2 px-4 rounded-8px"
    @click="$router.push({ name: routeName })"
  >
    <Icon
      :icon="icon"
      class="w-5 h-5 min-w-5 min-h-5"
    />

    <title-subtitle
      :title="title"
      :subtitle="description"
    />
    <div
      v-if="amethyst.store.settings.value.neonMode"
      class="blurLayer w-full opacity-0 duration-user-defined z-0 bg-primary filter h-full absolute top-0 left-0 blur-16px"
    />
  </button>
</template>

<style scoped lang="postcss">

button {
  @apply border-transparent;
  &.neonMode {
    @apply border-2 py-1 px-4;
  }

  &:not(.neonMode):hover:not(.active) {
    @apply bg-primary bg-opacity-15 text-primary;

    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary;
      @apply text-opacity-75;
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
    @apply text-primary text-opacity-75;
    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary;
      @apply text-opacity-100;
    }
  }
  
  &.neonMode.active {
    @apply border-2 border-primary text-primary;

    &::v-deep(h1),
    &::v-deep(p) {
      @apply text-primary;
    }

    &:hover {
      @apply bg-primary hover:bg-opacity-10;
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
