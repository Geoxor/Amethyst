<script setup lang="ts">
import { amethyst } from "@/amethyst";
import OutputDiagramBlob from "@/components/v2/OutputDiagramBlob.vue";
import TitleText from "@/components/v2/TitleText.vue";
import AmethystIcon from "@/icons/AmethystIcon.vue";
import AacLogo from "@/icons/logos/AacLogo.vue";
import ArturiaLogo from "@/icons/logos/ArturiaLogo.vue";
import AsioLogo from "@/icons/logos/AsioLogo.vue";
import FlacLogo from "@/icons/logos/FlacLogo.vue";
import FLStudioLogo from "@/icons/logos/FLStudioLogo.vue";
import FocusriteLogo from "@/icons/logos/FocusriteLogo.vue";
import JavascriptLogo from "@/icons/logos/JavascriptLogo.vue";
import Mp3Logo from "@/icons/logos/Mp3Logo.vue";
import NvidiaLogo from "@/icons/logos/NvidiaLogo.vue";
import OggLogo from "@/icons/logos/OggLogo.vue";
import OpusLogo from "@/icons/logos/OpusLogo.vue";
import RealtekLogo from "@/icons/logos/RealtekLogo.vue";
import SoundIDLogo from "@/icons/logos/SoundIDLogo.vue";
import SteamLogo from "@/icons/logos/SteamLogo.vue";
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";
import type { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";

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
        :subtitle="`${mimeType}\n${sampleRate/1000}kHz`"
      >
        <span class="text-text_title">
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
      
      <div
        v-if="amethyst.player.context.sampleRate != sampleRate"
        class="w-full h-2px bg-surface-600 mt-6"
      />

      <output-diagram-blob
        v-if="amethyst.player.context.sampleRate != sampleRate"
        :title="$t('output_diagram.resampler.title')"
        :subtitle="`Web Audio API\n${sampleRate/1000}kHz -> ${amethyst.player.context.sampleRate/1000}kHz`"
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

      <div
        v-if="amethyst.state.settings.value.audioDriver == 'default' && amethyst.getCurrentOperatingSystem() === 'windows'" 
        class="w-full h-2px bg-surface-600 mt-6" 
      />
      <output-diagram-blob
        v-if="amethyst.state.settings.value.audioDriver == 'default' && amethyst.getCurrentOperatingSystem() === 'windows'"
        :title="$t('output_diagram.os_api.title')"
        subtitle="WASAPI" 
      >
        <span class="text-text_title">
          <windows-logo />
        </span>
      </output-diagram-blob>

      <div class="w-full h-2px bg-surface-600 mt-6" />

      <output-diagram-blob
        :title="$t('output_diagram.audio_device.title')"
        :subtitle="amethyst.state.settings.value.outputAudioDeviceName"
      >
        <sound-i-d-logo v-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('soundid')" />
        <realtek-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('realtek')" />
        <steam-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('steam')" />
        <focusrite-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('focusrite')" />
        <arturia-logo v-else-if="['minifuse', 'arturia'].some(string => amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes(string))" />
        <nvidia-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('nvidia')" />
        <f-l-studio-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('fl studio')" />
        <!-- asio last incase we don't recognise the company of the specific asio device -->
        <asio-logo v-else-if="amethyst.state.settings.value.outputAudioDeviceName.toLowerCase().includes('asio')" />
        <icon
          v-else
          icon="ic:twotone-volume-up" 
          class="h-6 w-6 "
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