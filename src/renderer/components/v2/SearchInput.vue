<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue?: string}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<template>
  <input
    v-model="value"
    type="text"
    class="text-10px placeholder-text_subtitle text-text_title py-2 px-4 bg-surface-700 w-44 rounded-8px font-semibold"
    placeholder="Search"
    @keydown.stop
    @mousedown="$event.which == 3 && (value = '')"
  >
</template>
