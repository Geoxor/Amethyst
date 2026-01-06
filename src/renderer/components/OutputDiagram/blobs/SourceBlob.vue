<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { amethyst } from "@/amethyst.js";
import AacLogo from "@/icons/logos/AacLogo.vue";
import FlacLogo from "@/icons/logos/FlacLogo.vue";
import Mp3Logo from "@/icons/logos/Mp3Logo.vue";
import OggLogo from "@/icons/logos/OggLogo.vue";
import OpusLogo from "@/icons/logos/OpusLogo.vue";
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";
import type { Track } from "@/logic/track";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
import { MediaSourceType } from "@/logic/MediaSource";
const router = useRouter();

const sourceType = ref(MediaSourceType.Generic);

const updateSourceType = (track: Track) => {
  sourceType.value = track.sourceType;
};

onMounted(() => {
  const currentTrack = amethyst.player.getCurrentTrack();
  if (currentTrack) updateSourceType(currentTrack); ;
  amethyst.player.on("player:trackChange", updateSourceType);
  amethyst.player.on("player:currentTrackMetadataLoaded", updateSourceType);
});

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.source.title')"
    :subtitle="$t(sourceType)"
    clickable
    @click="router.push({ name: 'queue' })"
  >
    <icon
      v-if="sourceType == MediaSourceType.LocalFolder"
      class="h-6 w-6 text-text-title"
      icon="ic:twotone-audio-file"
    />
    <icon
      v-else-if="sourceType == MediaSourceType.Subsonic"
      class="h-6 w-6 text-text-title"
      icon="tabler:submarine"
    />

    <icon
      v-else
      class="h-6 w-6 text-text-title"
      icon="ic:twotone-question-mark"
    />
  </generic-blob>
  <blob-line />
</template>

<style scoped lang="postcss">

</style>
