<script setup lang="ts">
import { amethyst } from "@/amethyst";
import OutputDiagramBlob from "@/components/v2/OutputDiagramBlob.vue";
import TitleText from "@/components/v2/TitleText.vue";
import AmethystIcon from "@/icons/AmethystIcon.vue";
import AacLogo from "@/icons/logos/AacLogo.vue";
import FlacLogo from "@/icons/logos/FlacLogo.vue";
import JavascriptLogo from "@/icons/logos/JavascriptLogo.vue";
import Mp3Logo from "@/icons/logos/Mp3Logo.vue";
import OggLogo from "@/icons/logos/OggLogo.vue";
import OpusLogo from "@/icons/logos/OpusLogo.vue";
import RealtekLogo from "@/icons/logos/RealtekLogo.vue";
import SoundIDLogo from "@/icons/logos/SoundIDLogo.vue";
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";
import type { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";

const mimeType = ref("none");

const updateMimeType = (track: Track) => {
  const metadata = track.getMetadata();
  if (!metadata) return;
  mimeType.value = metadata.format.codec!;
};

onMounted(() => {
  mimeType.value = amethyst.player.getCurrentTrack()?.metadata.data?.format.codec || "none";
  amethyst.player.on("play", updateMimeType);
  amethyst.player.on("currentTrackMetadataLoaded", updateMimeType);
});
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <title-text :text="$t('output_diagram.title')" />
    <div class="flex items-top justify-between">
      <output-diagram-blob
        :title="$t('output_diagram.source.title')"
        :subtitle="mimeType"
      >
        <span class=" text-text_title">
          <flac-logo v-if="mimeType == 'FLAC'" />
          <mp3-logo v-else-if="mimeType == 'MPEG 1 Layer 3'" />
          <opus-logo v-else-if="mimeType == 'Opus'" />
          <ogg-logo v-else-if="mimeType == 'Vorbis I'" />
          <windows-logo v-else-if="['PCM', 'non-PCM (65534)', 'IEEE_FLOAT'].includes(mimeType)" />
          <aac-logo v-else-if="['AAC', 'MPEG-4/AAC'].includes(mimeType)" />
          <icon
            v-else
            class="h-6 w-6 text-text_title"
            icon="ic:twotone-question-mark"
          />
        </span>
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        :title="$t('output_diagram.decoder.title')"
        subtitle="Web Audio API"
      >
        <javascript-logo />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        :title="$t('output_diagram.dsp.title')"
        subtitle="Amethyst DSP"
      >
        <amethyst-icon class="text-accent" />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        :title="$t('output_diagram.audio_driver.title')"
        :subtitle="amethyst.player.outputDevice.value"
      >
        <sound-i-d-logo
          v-if="amethyst.player.outputDevice.value.toLowerCase().includes('soundid')"
          class="text-text_title"
        />
        <realtek-logo
          v-else-if="amethyst.player.outputDevice.value.toLowerCase().includes('realtek')"
          class="text-text_title"
        />
        <icon
          v-else
          icon="ic:twotone-volume-up" 
          class="h-6 w-6 text-text_title"
        />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        :title="$t('output_diagram.output.title')"
      >
        <icon
          icon="ic:twotone-volume-up" 
          class="h-6 w-6 text-text_title"
        />
      </output-diagram-blob>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>