<template>
  <div :class="[active ? 'text-primary' : 'text-white']" class="p-4 items-center hover:text-primary flex transition duration-200 justify-center">
    <component :is="icon" />
  </div>
</template>

<script setup lang="ts">
defineProps<{icon: any, active: boolean}>();

</script>

<style scoped lang="postcss">

</style>