<script setup lang="ts">
import { useVModel } from "@vueuse/core";
const props = defineProps<{ modelValue?: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);
</script>

<template>
  <div>
    <input
      v-model="value"
      type="radio"
      hidden
    >
    <svg
      v-if="!value"
      width="34"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="value = true"
    >
      <path
        d="M2 2h2v2H2V2ZM2 12h2v2H2v-2ZM0 4h2v8H0V4Z"
        class="fill-surface-600"
      />
      <path
        d="M12 2H4v2H2v8h2v2h8v-2h2V4h-2V2Z"
        fill="#fff"
      />
      <path
        d="M4 2h8v2h2v8h-2v2H4v2h26v-2h2v-2h2V4h-2V2h-2V0H4v2Z"
        class="fill-surface-600"
      />
    </svg>
    <svg
      v-else
      width="34"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="value = false"
    >
      <path
        d="M32 2H20v12h12V2Z"
        fill="#fff"
      />
      <path
        d="M32 2h-2v2h2V2ZM22 2H2v2h20V2Zm10 10h-2v2h2v-2Zm-10 0H2v2h20v-2Zm12-8h-2v8h2V4ZM20 4H0v8h20V4Zm10-4H4v2h26V0Zm0 14H4v2h26v-2Z"
        fill="#424681"
      />
      <path
        d="M6 2h16v2H6V2ZM4 4h16v2H4V4ZM2 6h18v2H2V6Zm0 2h18v2H2V8Zm2 2h16v2H4v-2Zm2 2h16v2H6v-2Z"
        fill="#868AFF"
      />
      <path
        d="M8 4h10v2H8V4ZM6 6h10v2H6V6Zm0 2h10v2H6V8Zm2 2h10v2H8v-2Z"
        fill="#E08EFF"
      />
      <path
        d="M6 2h16v2H6V2ZM4 4h16v2H4V4ZM2 6h18v2H2V6Zm0 2h18v2H2V8Zm2 2h16v2H4v-2Zm2 2h16v2H6v-2Z"
        fill="#868AFF"
      />
      <path
        d="M8 4h10v2H8V4ZM6 6h10v2H6V6Zm0 2h10v2H6V8Zm2 2h10v2H8v-2Z"
        fill="#E08EFF"
      />
    </svg>
  </div>
</template>

<style scoped lang="postcss">

</style>