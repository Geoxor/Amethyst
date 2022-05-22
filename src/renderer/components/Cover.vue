<script setup lang="ts">
import { onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { defaultCover, getCoverArt } from "../state";
const props = defineProps<{ songPath: string }>();
const coverArt = useLocalStorage(props.songPath, "");

onMounted(async () => {
  if (!coverArt.value)
    getCoverArt(props.songPath, coverArt);
});
</script>

<template>
  <img :src="coverArt ? `data:image/png;base64,${coverArt}` : defaultCover">
</template>

<style scoped lang="postcss">
</style>
