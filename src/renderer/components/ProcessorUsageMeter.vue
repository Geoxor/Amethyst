<template>
  <div
    class="font-small flex justify-center relative items-center text-7px bg-[#202020] text-[#888888] w-12 h-3.5 box-content border-[#303030]">
    <p class="z-10">{{ state.state.cpuUsage.toFixed(0)}}%</p>
    <div class="bg-surface-700 h-full h-full absolute top-0 left-0" :style="`width: ${state.state.cpuUsage}%;`" />
  </div>
</template>

<script setup lang="ts">
import { useState } from '../amethyst';
const state = useState();
</script>