<script setup lang="ts">
import type { Placement } from "@floating-ui/core";
import BasePopover from "@/components/BasePopover.vue";
defineProps<{
	text?: string
	placement?: Placement
	borderless?: boolean
}>();
</script>

<template>
  <base-popover
    open-on-hover
    :placement="placement"
    :arrow="true"
    class="tooltip mt-1"
    :class="borderless ? '' : ' border-1 border-surface-600 bg-surface-800 p-2' "
  >
    <slot />
    <template #content>
      <p class=" text-primary-1000  text-11px">
        {{ text }}
      </p>
      <slot name="content" />
    </template>
  </base-popover>
</template>

<style lang="postcss">
.tooltip {
  @apply z-2;
}
.tooltip.popover {
  @apply text-white shadow-xl;
}

</style>