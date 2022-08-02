<template>
  <settings-setting :text="text" :icon="icon">
    <binary-switch-input v-model="value" />
  </settings-setting>
</template>

<script setup lang="ts">
import BinarySwitchInput from '../input/BinarySwitchInput.vue';
import { useVModel } from "@vueuse/core";
import SettingsSetting from './SettingsSetting.vue';
const props = defineProps<{ text: string, icon?: any, modelValue: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>
