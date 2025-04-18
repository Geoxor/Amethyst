<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import { useInspector } from "@/components/Inspector";
import { AmethystIcon } from "@/icons";
import { Track } from "@/logic/track";

const handleContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, [
    { title: "Play", icon: AmethystIcon, action: () => amethyst.player.play(track) },
    { title: "Inspect", icon: AmethystIcon, action: () => useInspector().inspectAndShow(track) },
    // { title: "Show in Explorer...", icon: AmethystIcon, action: () => window.electron.ipcRenderer.invoke("show-item", [track.path]) },
    { title: "Reload metadata", icon: AmethystIcon, action: () => track.fetchAsyncData(true) },
    { title: "Remove from queue", icon: AmethystIcon, red: true, action: () => amethyst.player.queue.remove(track) },
  ]);
};

</script>

<template>
  <div class="p-2 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 h-min gap-1 w-full overflow-y-auto">
    <cover-art
      v-for="track of amethyst.player.queue.getList()"
      :key="track.path"
      class="transform-gpu duration-50 cursor-pointer hover:scale-105 w-full col-span-1 rounded-4px"
      :url="track.getCover()"
      @click="amethyst.player.play(track)"
      @contextmenu="handleContextMenu($event, track)"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>