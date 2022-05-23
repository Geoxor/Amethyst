<script setup lang="ts">
import { computed, onMounted } from "vue";
import { usePlayer, useState } from "../amethyst";
const props = defineProps<{ songPath: string }>();
const player = usePlayer();
const state = useState();
const coverArt = computed(() => state.state.coverCache[props.songPath]);

onMounted(async () => {
  if (!coverArt.value)
    player.getCoverArt(props.songPath);
});
</script>

<template>
  <img :src="coverArt ? `data:image/png;base64,${coverArt}` : state.state.defaultCover">
</template>

<style scoped lang="postcss">
</style>
