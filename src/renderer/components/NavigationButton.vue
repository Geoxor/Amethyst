<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const props = defineProps<{ icon: any, routeName: string, mobile?: boolean}>();
const route = useRoute();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);
const router = useRouter();
</script>

<template>
  <button
    :class="[
      isActive && 'active',
      mobile && 'rounded-full',
      amethyst.state.window.isFocused ? 'text-text_title' : 'text-text_subtitle'
    ]"

    class="duration-user-defined items-center gap-2 transition-colors duration-user-defined flex relative disable-select p-4 no-drag text-text_title rounded-r-8px"
    @click="router.push({ name: routeName })"
  >
    <icon
      v-if="icon"
      :icon="icon"
      class="h-5 w-5 min-h-5 min-w-5"
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
  @apply bg-accent text-settings-subsetting-background;
  & p, h1 {
    @apply text-settings-subsetting-background;
  }
}

</style>
