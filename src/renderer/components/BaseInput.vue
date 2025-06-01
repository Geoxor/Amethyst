<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="value"
    :type="type || 'text'"
    :placeholder="placeholder"
    class="bg-surface-600 max-w-48 w-full text-12px p-2 rounded-4px text-ellipsis"
  >
</template>

<style scoped lang="postcss">
input::placeholder {
  @apply text-text-title/50 text-12px;
}
</style>
