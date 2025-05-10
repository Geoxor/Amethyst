<script setup lang="ts">
import { Icon } from "@iconify/vue";
import BaseTooltip from "./BaseTooltip.vue";

defineProps<{ tooltipText?: string, active?: boolean, icon?: string, text?: string }>();
</script>

<template>
  <base-tooltip
    v-if="tooltipText"
    :text="tooltipText"
    :placement="'bottom'"
  >
    <button
      :class="active && 'active'"
      class="select-none text-primary-1000 rounded-2px p-1.5"
      v-bind="$attrs"
    >
      <icon
        v-if="icon"
        :icon="icon"
        class="h-4 w-5 min-h-4 min-w-5"
      />

      <p
        v-if="text"
        class="font-aseprite text-primary-900"
      >
        {{ text }}
      </p>
    </button>
  </base-tooltip>
  <button
    v-else
    :class="active && 'active'"
    class="select-none text-primary-1000 rounded-2px p-1.5"
    v-bind="$attrs"
  >
    <icon
      v-if="icon"
      :icon="icon"
      class="h-4 w-5 min-h-4 min-w-5"
    />

    <p
      v-if="text"
      class="font-aseprite text-primary-900"
    >
      {{ text }}
    </p>
  </button>
</template>

<style scoped lang="postcss">
button {
  @apply text-text-title;

  &.active, &:hover {
    @apply bg-primary-800 hover:bg-accent-800 text-accent;
  }
}
</style>