<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { amethyst } from "@/amethyst.js";
const props = defineProps<{ icon: any, routeName: string, mobile?: boolean}>();
const route = useRoute();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);
const router = useRouter();
</script>

<template>
  <button
    :class="[
      isActive && 'active',
      mobile ? 'rounded-full w-full justify-center p-4 py-3' : 'rounded-r-8px p-4',
      amethyst.state.window.isFocused ? 'text-text-title' : 'text-text-subtitle'
    ]"

    class="duration-user-defined items-center gap-2 transition-colors duration-user-defined flex relative disable-select no-drag text-text-title"
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
  @apply bg-accent/15 text-accent;
  & h1, p {
    @apply text-accent;
  }
  & p {
    @apply text-accent/75;
  }
}

button.active {
  @apply bg-accent text-settings-subsetting-background;
  & p, h1 {
    @apply text-settings-subsetting-background;
  }
}

</style>
