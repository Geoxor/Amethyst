<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useState } from "../state";
const props = defineProps<{ songPath: string }>();
const state = useState();
const coverArt = computed(() => state.state.coverCache[props.songPath]);

onMounted(async () => {
  if (!coverArt.value)
    state.getCoverArt(props.songPath);
});
</script>

<template>
  <img :src="coverArt ? `data:image/png;base64,${coverArt}` : state.state.defaultCover">
</template>

<style scoped lang="postcss">
</style>
