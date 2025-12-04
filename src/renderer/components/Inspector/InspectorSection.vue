<script setup lang="ts">
import { Icon } from "@iconify/vue";
defineProps<{
  title: string;
  icon: string;
}>();
</script>

<template>
  <section>
    <h1>
      <icon
        :icon="icon"
        class="h-5-w-5 min-w-5 min-h-5"
      />
      {{ $t(title) }}
    </h1>
    <slot />
  </section>
</template>
