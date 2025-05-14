<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import SettingsSetting from "@/components/settings/SettingsSetting.vue";

import ToggleSwitch from "../v2/ToggleSwitch.vue";
const props = defineProps<{ text: string, icon?: any, modelValue: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <settings-setting
    :text="text"
    :icon="icon"
  >
    <toggle-switch v-model="value" />
  </settings-setting>
</template>