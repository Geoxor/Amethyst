<script setup lang="ts">
import { computed } from "vue";
import TitleSubtitle from "./TitleSubtitle.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps<{title: string, subtitle?: string, icon: any, routeName: string}>();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);

</script>

<template>
  <button
    :class="isActive && 'active'"
    class="flex w-full gap-4 cursor-pointer bg-transparent duration-100 text-text_title items-center py-2 px-4 rounded-8px"
    @click="$router.push({ name: routeName })"
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

<style scoped lang="postcss">

button:hover:not(.active) {
  @apply bg-primary bg-opacity-10 text-primary;

  &::v-deep(h1) {
    @apply text-primary;
  }
  &::v-deep(p) {
    @apply text-primary;
    @apply text-opacity-75;
  }
}

button.active {
  @apply bg-primary text-[#101119];

  &::v-deep(h1), 
  &::v-deep(p) {
    @apply text-[#101119];
  }
}

</style>
