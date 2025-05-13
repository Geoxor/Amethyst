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
import type { Track } from "@/logic/track";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
const router = useRouter();

const mimeType = ref("none");
const sampleRate = ref(amethyst.player.context.sampleRate);

const updateMimeType = (track: Track) => {
  const metadata = track.getMetadata();
  if (!metadata) return;
  mimeType.value = metadata.format.codec || "none";
  sampleRate.value = metadata.format.sampleRate!;
};

onMounted(() => {
  const currentTrack = amethyst.player.getCurrentTrack();
  if (currentTrack) updateMimeType(currentTrack);;
  amethyst.player.on("player:play", updateMimeType);
  amethyst.player.on("player:currentTrackMetadataLoaded", updateMimeType);
});

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.source.title')"
    :subtitle="`${mimeType}\n${sampleRate/1000}kHz`"
    clickable
    @click="router.push({ name: 'queue' })"
  >
    <span class="text-text-title">
      <flac-logo v-if="mimeType == 'FLAC'" />
      <mp3-logo v-else-if="mimeType == 'MPEG 1 Layer 3'" />
      <opus-logo v-else-if="mimeType == 'Opus'" />
      <ogg-logo v-else-if="mimeType == 'Vorbis I'" />
      <windows-logo v-else-if="['PCM', 'non-PCM (65534)', 'IEEE_FLOAT'].includes(mimeType)" />
      <aac-logo v-else-if="['AAC', 'MPEG-4/AAC'].includes(mimeType)" />
      <icon
        v-else
        class="h-6 w-6 text-text-title"
        icon="ic:twotone-question-mark"
      />
    </span>
  </generic-blob>
  <blob-line />
</template>

<style scoped lang="postcss">

</style>