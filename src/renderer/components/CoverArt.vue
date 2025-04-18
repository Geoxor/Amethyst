<script setup lang="ts">
import {AmethystIcon } from "@/icons";
defineProps<{ url?: string }>();
</script>

<template>
  <img
    v-if="url"
    :src="url"
    class="disable-select no-drag bg-slider-background"
  >
  <div
    v-else
    class="flex items-center justify-center bg-slider-background bg-opacity-50 disable-select no-drag"
  >
    <amethyst-icon />
  </div>
</template>
