<template>
  <div class=" flex justify-center relative items-center bg-surface-600 text-primary-900 w-12 h-3.5 box-content ">
    <p class="font-aseprite z-10">{{ state.state.cpuUsage.toFixed(0) }}%</p>
    <div class="bg-primary-800 h-full duration-500 h-full absolute top-0 left-0"
      :style="`width: ${state.state.cpuUsage}%;`" />
  </div>
</template>

<script setup lang="ts">
import { useState } from '@/amethyst';
const state = useState();
</script>
