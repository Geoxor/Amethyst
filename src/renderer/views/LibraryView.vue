<script setup lang="ts">
import CoverArt from "@/components/CoverArt.vue";
import { player } from "@/logic/player";

</script>

<template>
  <div class="p-2 grid grid-cols-16 h-min gap-1 w-full">
    <CoverArt
      v-for="track of player.queue.getList()"
      :key="track.path"
      class="transform-gpu duration-50 cursor-pointer hover:scale-105 w-full col-span-1 rounded-4px"
      :url="track.getCover()"
      @click="player.play(track)"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>