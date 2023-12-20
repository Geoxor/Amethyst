<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { Track } from "@/logic/track";
import { computed, onMounted, ref } from "vue";
import CoverArt from "../CoverArt.vue";

const props = defineProps<{track: Track}>();
const coverUrl = ref("");
onMounted(() => {
  props.track.getCoverAsBlob().then(blob => coverUrl.value = URL.createObjectURL(blob));
});

const coverGridSize = computed(() => amethyst.store.settings.value.coverGridSize);

</script>

<template>
  <div
    class="track gap-2 flex flex-col cursor-pointer"
    :class="`w-[${coverGridSize}px]`"
    @click="amethyst.player.play(track)"
  >
    <cover-art 
      :url="coverUrl"
      class="rounded-8px w-0 h-0"
      :class="`w-[${coverGridSize}px] h-[${coverGridSize}px]`"
    />
    <div class="flex flex-col gap-5px text-left py-1 w-full text-center">
      <h1 class="text-text_title text-13px font-semibold w-full overflow-hidden overflow-ellipsis">
        {{ track.getTitle() || track.getFilename() }}
      </h1>
      <p class="text-text_subtitle text-10px font-semibold w-full overflow-hidden overflow-ellipsis">
        {{ track.getArtistsFormatted() || 'Unknown Artist' }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.track:hover {
  & .cover {
    @apply bg-primary bg-opacity-50; 
  }

  h1, p {
    @apply text-primary;
  }
}
</style>