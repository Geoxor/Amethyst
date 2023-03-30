<script setup lang="ts">
import BaseSlider from "@/components/input/BaseSlider.vue";
import { watch, ref } from "vue";

const props = defineProps<{
  param: AudioParam,
  min: number,
  max: number,
  step: number,
  log?: boolean,
  suffix: string,
  digits: number;
}>();

const paramValue = ref(props.log ? log10(props.param.value) : props.param.value);

watch(paramValue, newValue => {
  props.param.value = props.log ? antilog10(newValue) : newValue;
});

watch(props.param, newParam => {
  paramValue.value = props.log ? log10(newParam.value) : newParam.value;
});

function updateParamValue(event: Event) {
  paramValue.value = parseFloat((event.target as HTMLInputElement).value);
}

function log10(value: number) {
  return Math.log10(value);
}

function antilog10(value: number) {
  return Math.pow(10, value);
}
</script>

<template>
  <div class="flex gap-2 justify-between w-full">
    {{ (log ? antilog10(paramValue) : paramValue).toFixed(digits) }} {{ suffix }}
    <BaseSlider 
      v-model="paramValue"
      class="w-24"
      type="range"
      :min="log ? log10(min) : min"
      :max="log ? log10(max) : max"
      :step="step"
      @input="updateParamValue"
      @mousedown.stop
    />
  </div>
</template>
