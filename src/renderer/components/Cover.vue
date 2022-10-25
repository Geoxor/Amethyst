<script setup lang="ts">
import { useState } from "@/amethyst";
defineProps<{ url?: string }>();
const state = useState();
</script>

<template>
  <img :src="url || state.state.defaultCover">
</template>
