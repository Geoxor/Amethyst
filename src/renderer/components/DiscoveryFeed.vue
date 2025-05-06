<script setup lang="ts">
import type { Track } from "@/logic/track";
import TrackCard from "./TrackCard.vue";
import TitleText from "./v2/TitleText.vue";

const props = defineProps<{title: string, tracks: Track[]}>();
</script>

<template>
  <div class="flex gap-2 flex-col ">
    <title-text :text="title" />
    <section class="flex gap-2 w-full overflow-x-auto p-2 ">
      <track-card
        v-for="track of tracks"
        :key="track.path"
        :track="track"
      >
        {{ track.getFilename() }}
      </track-card>
    </section>
  </div>
</template>

<style scoped lang="postcss">

</style>