<script setup lang="ts">
import BaseTooltip from "./BaseTooltip.vue";

defineProps<{ tooltipText?: string, active?: boolean, icon?: any, text?: string }>();
</script>

<template>
  <BaseTooltip
    v-if="tooltipText"
    :text="tooltipText"
    :placement="'bottom'"
  >
    <button
      :class="active && 'active'"
      class="select-none text-primary-1000 rounded-2px p-1.5"
      v-bind="$attrs"
    >
      <component
        :is="icon"
        v-if="icon"
      />

      <p
        v-if="text"
        class="font-aseprite text-primary-900"
      >
        {{ text }}
      </p>
    </button>
  </BaseTooltip>
  <button
    v-else
    :class="active && 'active'"
    class="select-none text-primary-1000 rounded-2px p-1.5"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
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
  &.active, &:hover {
    @apply bg-primary-800 hover:bg-primary-800 text-black;
  }
}
</style>