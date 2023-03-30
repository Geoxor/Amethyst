<script setup lang="ts">
import { useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import { useInspector } from "@/components/Inspector";
import { PlayIcon, BinocularsIcon, ResetIcon, RemoveIcon } from "@/icons/material";
import { player } from "@/logic/player";
import { Track } from "@/logic/track";

const handleContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, [
    { title: "Play", icon: PlayIcon, action: () => player.play(track) },
    { title: "Inspect", icon: BinocularsIcon, action: () => useInspector().inspectAndShow(track) },
    // { title: "Show in Explorer...", icon: ExternalLinkIcon, action: () => window.electron.ipcRenderer.invoke("show-item", [track.path]) },
    { title: "Reload metadata", icon: ResetIcon, action: () => track.fetchAsyncData(true) },
    { title: "Remove from queue", icon: RemoveIcon, red: true, action: () => player.queue.remove(track) },
  ]);
};

</script>

<template>
  <div class="p-2 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 h-min gap-1 w-full overflow-y-auto">
    <CoverArt
      v-for="track of player.queue.getList()"
      :key="track.path"
      class="transform-gpu duration-50 cursor-pointer hover:scale-105 w-full col-span-1 rounded-4px"
      :url="track.getCover()"
      @click="player.play(track)"
      @contextmenu="handleContextMenu($event, track)"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>