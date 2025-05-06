<script setup lang="ts">
import { amethyst } from "@/amethyst";
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";
import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
</script>

<template>
  <generic-blob
    v-if="amethyst.state.settings.value.audio.driver == 'default' && amethyst.getCurrentOperatingSystem() === 'windows'"
    :title="$t('output_diagram.os_api.title')"
    subtitle="WASAPI" 
  >
    <span class="text-text_title">
      <windows-logo />
    </span>
  </generic-blob>
  <blob-line />
</template>
