<template>
  <div class="p-2 bg-dark-400 flex flex-col gap-2 relative leading-2 font-small text-7px w-full whitespace-normal">
    <p>{{ notification.title }}</p>
    <p v-html="notification.body" class="body text-true-gray-400 overflow-hidden overflow-ellipsis"> </p>

    <p class="hover:text-primary absolute top-2 right-2 text-12px" @click="notification.clear()">x</p>
  </div>
</template>

<script setup lang="ts">
import { AmetyhstNotification } from '../../notification.js';
defineProps<{ notification: AmetyhstNotification }>();
</script>

<style lang="postcss">
.body strong {
  @apply text-primary underline;
}
</style>