<script setup lang="ts">
import { Icon } from "@iconify/vue";
defineProps<{ icon?: any, color?: string }>();
</script>

<template>
  <div
    class="select-none justify-center text-11px font-weight-user-defined flex items-center gap-1 rounded-full py-0.5 px-1"
    :class="color ? `bg-${color}/15 text-${color}` : 'bg-primary/15 text-primary '"
  >
    <icon
      v-if="icon"
      :icon="icon"
      class="w-4 h-4"
    />

    <p class="flex items-center gap-1">
      <slot />
    </p>
  </div>
</template>
