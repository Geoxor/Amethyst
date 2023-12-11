<script setup lang="ts">
import { useVModel as useModelValue } from "@vueuse/core";
import SubtitleText from "../v2/SubtitleText.vue";
const props = defineProps<{modelValue: boolean}>();
const emits = defineEmits(["update:modelValue", "change"]);
const value = useModelValue(props, "modelValue", emits);
</script>

<template>
  <button
    class="px-4 py-1 rounded-full"
    :class="[value ? 'bg-primary' : 'bg-accent bg-opacity-15']"
    @click="emits('update:modelValue', !value); emits('change')"
  >
    <subtitle-text
      :text="value ? 'ON' : 'OFF'"
      :class="[value ? 'text-surface-1000' : 'text-accent']"
      class="pointer-events-none "
    />
  </button>
</template>

<style scoped lang="postcss">
button:hover:not(.bg-primary) {
  @apply bg-accent hover:bg-opacity-25;
}
</style>