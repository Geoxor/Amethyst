<script setup lang="ts">
import { computed, onMounted } from "vue";
import { defaultCover, getCoverArt, useState } from "../state";
const props = defineProps<{ songPath: string }>();
const state = useState();
const coverArt = computed(() => state.coverCache[props.songPath]);

onMounted(async () => {
  if (!coverArt.value)
    getCoverArt(props.songPath);
});
</script>

<template>
  <img :src="coverArt ? `data:image/png;base64,${coverArt}` : defaultCover">
</template>

<style scoped lang="postcss">
</style>
