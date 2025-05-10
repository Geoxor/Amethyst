<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import TitleText from "@/components/v2/TitleText.vue";

import ApiBlob from "./blobs/ApiBlob.vue";
import AudioDeviceBlob from "./blobs/AudioDeviceBlob.vue";
import DecoderBlob from "./blobs/DecoderBlob.vue";
import DspBlob from "./blobs/DspBlob.vue";
import OutputBlob from "./blobs/OutputBlob.vue";
import ResamplerBlob from "./blobs/ResamplerBlob.vue";
import SourceBlob from "./blobs/SourceBlob.vue";

</script>

<template>
  <div class="flex flex-col gap-3 w-full ">
    <title-text :text="$t('output_diagram.title')" />
    <div class="flex ">
      <source-blob />
      <decoder-blob />
      <resampler-blob v-if="amethyst.player.getCurrentTrack() && amethyst.player.context.sampleRate != amethyst.player.getCurrentTrack()!.getSampleRate()" />
      <dsp-blob />
      <api-blob />
      <audio-device-blob />
      <output-blob />
    </div>
  </div>
</template>
