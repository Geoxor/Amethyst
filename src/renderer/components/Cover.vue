<script setup lang="ts">
import { Buffer } from "buffer";
import { computed, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { defaultCover, getCoverArt } from "../state";
const props = defineProps<{ songPath: string }>();
// base64
const coverArt = useLocalStorage(props.songPath, "");

onMounted(async () => {
  if (!coverArt.value)
getCoverArt(props.songPath, coverArt);
});

const cover = computed(() => {
  if (!coverArt.value)
    return defaultCover.value;

  const buffer = Buffer.from(coverArt.value, "base64");
  const blob = new Blob([buffer], { type: "image/png" });
  return URL.createObjectURL(blob);
});
</script>

<template>
  <img :src="cover">
</template>

<style scoped lang="postcss">
</style>
