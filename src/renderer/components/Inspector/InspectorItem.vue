<script setup lang="ts">
defineProps<{
  name: string;
  value: string | number | undefined;
}>();
</script>

<template>
  <li>
    <h1>{{ $t(name) }}</h1>
    <p> {{ value }}</p>
  </li>
</template>
