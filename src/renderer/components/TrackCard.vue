<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { getThemeColorHex } from "@/logic/color";
import { trackContextMenuOptions, type Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { Vibrant } from "node-vibrant/browser";
import { onMounted, ref } from "vue";
import { useContextMenu } from "./ContextMenu";
import CoverArt from "./CoverArt.vue";
import TitleSubtitle from "./v2/TitleSubtitle.vue";

const props = defineProps<{track: Track}>();

const color = ref("");

const handleTrackContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, trackContextMenuOptions(track));

};

const setDynamicColors = async (track: Track) => {
  const coverBase64 = track.getCover();
  if (!coverBase64) return getThemeColorHex("--accent");
  
  const palette = await Vibrant.from(coverBase64).getPalette();
  if (!palette.LightVibrant) return getThemeColorHex("--accent");

  return palette.LightVibrant.hex;
};

onMounted(() => {
  color.value = getThemeColorHex("--accent");
  setDynamicColors(props. track).then(newColor => {
    color.value = newColor;
  });
});
</script>

<template>
  <div
    class="flex flex-col gap-2 items-center w-min cursor-pointer overflow-visible hover:underline"
    @click="amethyst.player.play(track)"
    @contextmenu="handleTrackContextMenu($event, track)"
  >
    <span class="relative overflow-hidden rounded-[8px] transition-all duration-100 transform-gpu hover:scale-110">
      <h1
        v-if="amethyst.analytics.getPlayCount(track)"
        class="absolute flex items-center gap-0.5 top-0 font-weight-user-defined right-0 min-w-4 text-[12px] text-center p-1 z-5 rounded-bl-[8px] text-black"
        :class="[`bg-[${color}]`]"
      >
      
        <icon
          icon="ic:twotone-refresh"
          class="w-4 h-4"
        />
        {{ amethyst.analytics.getPlayCount(track) }}</h1>

      <template v-if="amethyst.player.getCurrentTrack() == track">
        <icon
          v-if="amethyst.player.isPlaying.value"
          icon="ic:round-play-arrow"
          class="icon"
        />
        <icon
          v-else
          icon="ic:round-pause"
          class="icon"
        />
      </template>

      <div class="bg-surface-1000">
        <cover-art
          :url="track.getCover()"
          :class="[amethyst.player.getCurrentTrack() == track && 'opacity-35']"
          class="min-w-32 min-h-32"
        />
      </div>
    </span>
    <title-subtitle
      class="text-center max-w-32 overflow-hidden overflow-ellipsis"
      :title="track.getTitleFormatted()"
      :subtitle="track.getArtistsFormatted()"
    />
  </div>
</template>

<style scoped>
@import "../base.css";

.icon {
  @apply h-16 w-16 absolute top-1/2 left-1/2 z-1 transform-gpu -translate-x-1/2 -translate-y-1/2;
}
</style>