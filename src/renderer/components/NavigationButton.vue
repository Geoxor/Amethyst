<script setup lang="ts">
defineProps<{ icon: any, active: boolean, notifs?: number }>();
</script>

<template>
  <div
    :class="[active ? 'text-primary-900' : 'text-white']"
    class="p-3 items-center hover:text-primary-900 flex relative justify-center"
  >
    <component :is="icon" />
    <div
      v-if="notifs"
      class="absolute top-2 right-0 transform -translate-x-1/2 p-0.5 overflow-hidden text-primary-900 font-aseprite text-7px items-center flex justify-center"
    >
      {{ notifs }}
    </div>
  </div>
</template>
