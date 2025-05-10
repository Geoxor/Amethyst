<script setup lang="ts">
import AmethystIcon from "@/icons/AmethystIcon.vue";
defineProps<{ url?: string }>();
</script>

<template>
  <img
    v-if="url"
    :src="url"
    alt="Cover Art"
    class="disable-select no-drag bg-slider-background"
  >
  <div
    v-else
    class="flex items-center justify-center bg-slider-background disable-select no-drag"
  >
    <amethyst-icon />
  </div>
</template>
