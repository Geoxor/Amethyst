<script setup lang="ts">
import TitleSubtitle from "@/components/v2/TitleSubtitle.vue";
</script>

<template>
  <div class="text-12px p-2 w-full borderRight">
    <header class="italic opacity-50 text-primary-1000">
      This is the playground area, use this view to test out and develop components
    </header>
    <title-subtitle :title="'test'" />
  </div>
</template>