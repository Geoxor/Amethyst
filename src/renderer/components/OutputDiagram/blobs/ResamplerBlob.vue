<script setup lang="ts">
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";
import JavascriptLogo from "@/icons/logos/JavascriptLogo.vue";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";

const contextSampleRate = computed(() => amethyst.player.context.sampleRate);
const sourceSampleRate = computed(() => amethyst.player.getCurrentTrack()!.getSampleRate()!);
</script>

<template>
  <generic-blob
    v-if="contextSampleRate != sourceSampleRate"
    :title="$t('output_diagram.resampler.title')"
    :subtitle="`Web Audio API\n${sourceSampleRate/1000}kHz -> ${contextSampleRate/1000}kHz`"
  >
    <javascript-logo />
  </generic-blob>
  <blob-line />
</template>