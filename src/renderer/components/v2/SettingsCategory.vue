<script setup lang="ts">
import TitleSubtitle from "./TitleSubtitle.vue";
defineProps<{isActive?: boolean, title: string, subtitle?: string, icon: any}>();
</script>

<template>
  <button
    :class="isActive && 'active'"
    class="flex w-full gap-4 cursor-pointer bg-transparent duration-100 text-text_title items-center py-2 px-4 rounded-8px"
  >
    <component
      :is="icon"
      class="w-5 h-5"
    />
    <title-subtitle
      :title="title"
      :subtitle="subtitle"
    />
  </button>
</template>

<style lang="postcss">

button:hover:not(.active) {
  @apply bg-primary bg-opacity-10 text-primary;
  & h1, p {
    @apply text-primary;
  }
  & p {
    @apply text-opacity-75;
  }
}

button.active {
  @apply bg-primary text-[#101119];
  & p, h1 {
    @apply text-[#101119];
  }
}

</style>
