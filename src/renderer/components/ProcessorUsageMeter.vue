<script setup lang="ts">
import TitleText from "./v2/TitleText.vue";

defineProps<{value: number; }>();
</script>

<template>
  <div class="flex justify-center relative items-center overflow-hidden bg-surface-600 text-primary-800 duration-250 rounded-8px w-full h-3.5 box-content ">
    <title-text
      class="text-11px"
      :text="`${value.toFixed(0)} %`"
    />
    <div
      class="bg-primary h-full duration-500 h-full absolute top-0 left-0"
      :style="`width: ${value}%;`"
    />
  </div>
</template>
