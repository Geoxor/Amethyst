<script setup lang="ts">
import {NoImageIcon } from "@/icons/material";
defineProps<{ url?: string }>();
</script>

<template>
  <img
    v-if="url"
    :src="url"
  >
  <div
    v-else
    class="flex items-center justify-center bg-surface-1000"
  >
    <NoImageIcon />
  </div>
</template>
