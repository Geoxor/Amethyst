<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import WindowsLogo from "@/icons/logos/WindowsLogo.vue";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
</script>

<template>
  <generic-blob
    v-if="amethyst.state.settings.audio.driver == 'default' && amethyst.getCurrentOperatingSystem() === 'windows'"
    :title="$t('output_diagram.os_api.title')"
    subtitle="WASAPI"
  >
    <windows-logo />
  </generic-blob>
  <blob-line />
</template>
