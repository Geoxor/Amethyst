<script setup lang="ts">
import { computed } from "vue";
import { useState } from "../amethyst";
const props = defineProps<{ songPath: string }>();
const state = useState();
const coverArt = computed(() => state.state.coverCache[props.songPath]);

// onMounted(async () => {
//   if (!coverArt.value)
//     player.getCoverArt(props.songPath);
// });
</script>

<template>
  <img :src="coverArt ? `data:image/png;base64,${coverArt}` : state.state.defaultCover">
</template>

<style scoped lang="postcss">
</style>
