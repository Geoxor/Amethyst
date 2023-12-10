<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{ icon: any, routeName: string, mobile?: boolean}>();
const route = useRoute();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);
</script>

<template>
  <button
    :class="[
      isActive && 'active',
      mobile && 'rounded-full'
    ]"
    class="items-center gap-2 duration-100 flex relative disable-select p-4 no-drag text-text_title rounded-r-8px"
    @click="$router.push({ name: routeName })"
  >
    <component
      :is="icon"
      class="w-5 h-5"
    />
  </button>
</template>

<style scoped lang="postcss">

button:hover:not(.active) {
  @apply bg-accent bg-opacity-15 text-accent;
  & h1, p {
    @apply text-accent;
  }
  & p {
    @apply text-opacity-75;
  }
}

button.active {
  @apply bg-accent text-[#101119];
  & p, h1 {
    @apply text-[#101119];
  }
}

</style>
