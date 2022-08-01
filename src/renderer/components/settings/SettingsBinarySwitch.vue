<template>
  <div class="flex items-center justify-between gap-2">
    <p>{{text}}</p>
    <binary-switch-input v-model="value" />
  </div>
</template>

<script setup lang="ts">
import BinarySwitchInput from '../input/BinarySwitchInput.vue';
import { useVModel } from "@vueuse/core";
const props = defineProps<{text: string, icon?: any, modelValue: boolean}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<style scoped lang="postcss">

</style>