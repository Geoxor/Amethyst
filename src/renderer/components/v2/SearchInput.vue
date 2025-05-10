<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue?: string}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<template>
  <input
    v-model="value"
    :class="[value && 'border-2 border-accent']"
    type="text"
    class="text-11px placeholder-text-subtitle  text-text-title py-1 px-4 bg-surface-700 w-44 rounded-8px font-weight-user-defined"
    :placeholder="$t('search.placeholder')"
    @keydown.stop
    @mousedown="$event.which == 3 && (value = '')"
  >
</template>
