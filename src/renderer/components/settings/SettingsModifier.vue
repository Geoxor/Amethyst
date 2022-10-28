<script setup lang="ts">
import DraggableModifierInput from "@/components/input/DraggableModifierInput.vue";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import { useVModel } from "@vueuse/core";
const props = defineProps<{ text: string, icon?: any, modelValue: number, range?: number[], min?: number, max?: number, step?: number, def: number }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <settings-setting
    :text="text"
    :icon="icon"
  >
    <draggable-modifier-input
      v-model="value"
      :range="range"
      :min="min"
      :max="max"
      :step="step"
      :default="def"
    />
  </settings-setting>
</template>