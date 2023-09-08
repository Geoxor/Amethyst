<script setup lang="ts">
import {NoImageIcon } from "@/icons/material";
defineProps<{ url?: string }>();
</script>

<template>
  <img
    v-if="url"
    :src="url"
    class="disable-select no-drag"
  >
  <div
    v-else
    class="flex items-center justify-center bg-surface-1000 disable-select no-drag"
  >
    <NoImageIcon />
  </div>
</template>
