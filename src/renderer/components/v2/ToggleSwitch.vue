<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { useVModel as useModelValue } from "@vueuse/core";
const props = defineProps<{modelValue: boolean}>();
const emits = defineEmits(["update:modelValue", "change"]);
const value = useModelValue(props, "modelValue", emits);
</script>

<template>
  <button
    class="px-4 cursor-pointer py-1.5 w-12 min-w-12 flex justify-center rounded-full relative"
    :class="[value ? (amethyst.state.settings.appearance.neonMode ? 'neonMode' : 'bg-primary text-surface-700') : 'bg-accent bg-opacity-15']"
    @click="emits('update:modelValue', !value); emits('change')"
  >
    <div
      class="w-3 rounded-full h-1"
      :class="[value ? 'bg-surface-400' : 'bg-accent' ]"
    />
    <div
      v-if="amethyst.state.settings.appearance.neonMode && value"
      class="w-full opacity-50 duration-user-defined blurLayer z-0 bg-primary filter h-full absolute top-0 left-0 blur-16px"
    />
  </button>
</template>

<style scoped lang="postcss">
button:hover:not(.neonMode):not(.bg-primary) {
  @apply bg-accent hover:bg-opacity-25;
}

button.neonMode {
  @apply border-2 border-primary text-primary;

  &:hover {
    @apply bg-primary bg-opacity-15;
  }
}

button:hover > .blurLayer {
  @apply opacity-75;
}
</style>