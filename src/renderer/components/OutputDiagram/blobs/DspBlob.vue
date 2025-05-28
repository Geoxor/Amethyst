<script setup lang="ts">
import { useRouter } from "vue-router";

import { amethyst } from "@/amethyst";
import AmethystIcon from "@/icons/AmethystIcon.vue";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
const router = useRouter();

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.dsp.title')"
    clickable
    :subtitle="amethyst.player.nodeManager.nodes.value.length - 3 > 0 ? `Amethyst DSP\n${amethyst.player.nodeManager.nodes.value.length - 3} ${$t('output_diagram.dsp.node_count')}` : 'Amethyst DSP'"
    @click="router.push({ name: 'node-editor' })"
  >
    <amethyst-icon class="text-accent" />
  </generic-blob>
  <blob-line />
</template>