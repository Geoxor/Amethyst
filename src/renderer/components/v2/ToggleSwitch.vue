<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { useVModel as useModelValue } from "@vueuse/core";
const props = defineProps<{modelValue: boolean}>();
const emits = defineEmits(["update:modelValue", "change"]);
const value = useModelValue(props, "modelValue", emits);

amethyst.store.settings.value.neonMode;

</script>

<template>
  <button
    class="px-4 py-1 w-12 rounded-full relative"
    :class="[value ? (amethyst.store.settings.value.neonMode ? 'neonMode' : 'bg-primary text-surface-700') : 'bg-accent bg-opacity-15']"
    @click="emits('update:modelValue', !value); emits('change')"
  >
    <p 
      class="pointer-events-none text-10px font-semibold"
    >
      {{ value ? 'I' : 'O' }}
    </p>
    <div
      v-if="amethyst.store.settings.value.neonMode && value"
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