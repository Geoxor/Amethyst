<template>
  <div :class="[active ? 'text-primary' : 'text-white']"
    class="p-4 items-center hover:text-primary flex transition relative duration-200 justify-center">
    <component :is="icon" />
    <div v-if="notifs"
      class="absolute top-2 right-0 transform -translate-x-1/2 p-0.5 overflow-hidden text-primary font-aseprite text-7px items-center flex justify-center">
      {{ notifs }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: any, active: boolean, notifs?: number }>();

</script>

<style scoped lang="postcss">

</style>