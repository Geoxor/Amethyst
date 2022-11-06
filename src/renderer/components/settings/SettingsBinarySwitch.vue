<script setup lang="ts">
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import { useVModel } from "@vueuse/core";
import BaseSwitch from "../input/BaseSwitch.vue";
const props = defineProps<{ text: string, icon?: any, modelValue: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <settings-setting
    :text="text"
    :icon="icon"
  >
    <base-switch v-model="value" />
  </settings-setting>
</template>