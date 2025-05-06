<script setup lang="ts">
import { Icon } from "@iconify/vue";
import GenericBlob from "./GenericBlob.vue";

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.output.title')"
  >
    <icon
      icon="ic:twotone-volume-up" 
      class="h-6 w-6 text-text_title"
    />
  </generic-blob>
</template>
