<script setup lang="ts">
import type { Track } from "@/logic/track";
import TrackCard from "./TrackCard.vue";
import TitleSubtitle from "./v2/TitleSubtitle.vue";

const props = defineProps<{title: string, subtitle: string, tracks: Track[]}>();
</script>

<template>
  <div class="flex gap-2 flex-col ">
    <title-subtitle
      :title="title"
      :subtitle="subtitle"
    />
    <section class="flex gap-2 w-full overflow-x-auto p-2 ">
      <track-card
        v-for="track of tracks"
        :key="track.path"
        :track="track"
      />
    </section>
  </div>
</template>

<style scoped lang="postcss">

</style>