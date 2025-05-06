<script setup lang="ts">
import AmethystIcon from "@/icons/AmethystIcon.vue";
import { useRouter } from "vue-router";
import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
const router = useRouter();

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.dsp.title')"
    clickable
    subtitle="Amethyst DSP"
    @click="router.push({ name: 'node-editor' })"
  >
    <amethyst-icon class="text-accent" />
  </generic-blob>
  <blob-line />
</template>