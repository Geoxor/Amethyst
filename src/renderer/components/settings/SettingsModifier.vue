<template>
  <settings-setting :text="text" :icon="icon">
    <draggable-modifier-input v-model="value" :range="range" :min="min" :max="max" :step="step" :default="default" />
  </settings-setting>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import SettingsSetting from './SettingsSetting.vue';
import DraggableModifierInput from '../input/DraggableModifierInput.vue';
const props = defineProps<{ text: string, icon?: any, modelValue: number, range?: number[], min?: number, max?: number, step?: number, default: number }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>
