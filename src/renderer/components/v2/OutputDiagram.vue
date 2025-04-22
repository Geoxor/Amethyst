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
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
const mimeType = computed(() => amethyst.player.getCurrentTrack()?.metadata.data?.format.codec || "Paused");
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <title-text text="Output Diagram" />
    <div class="flex items-top justify-between">
      <output-diagram-blob
        title="Source"
        :subtitle="mimeType"
      >
        <flac-logo v-if="mimeType == 'FLAC'" />
        <mp3-logo v-else-if="mimeType == 'MPEG 1 Layer 3'" />
        <opus-logo v-else-if="mimeType == 'Opus'" />
        <ogg-logo v-else-if="mimeType == 'Vorbis I'" />
        <windows-logo v-else-if="['PCM', 'non-PCM (65534)'].includes(mimeType)" />
        <aac-logo v-else-if="mimeType == 'AAC'" />
        <icon
          v-else
          class="h-6 w-6 text-text_title"
          icon="ic:twotone-question-mark"
        />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        title="Decoder"
        subtitle="Web Audio API"
      >
        <javascript-logo />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        title="DSP"
        subtitle="Amethyst DSP"
      >
        <amethyst-icon class="text-accent" />
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        title="Output"
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