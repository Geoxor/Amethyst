<script setup lang="ts">
import BinarySwitchInput from '@/components/input/BinarySwitchInput.vue';
import SettingsSetting from '@/components/settings/SettingsSetting.vue';
import { useVModel } from "@vueuse/core";
const props = defineProps<{ text: string, icon?: any, modelValue: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <settings-setting :text="text" :icon="icon">
    <binary-switch-input v-model="value" />
  </settings-setting>
</template>