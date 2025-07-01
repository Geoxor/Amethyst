<script setup lang="ts">
import JavascriptLogo from "@/icons/logos/JavascriptLogo.vue";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.decoder.title')"
    subtitle="Web Audio API"
  >
    <javascript-logo />
  </generic-blob>
  <blob-line />
</template>
