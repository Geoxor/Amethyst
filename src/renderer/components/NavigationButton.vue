<script setup lang="ts">
defineProps<{ icon: any, active: boolean, notifs?: number, text?: string, description?: string }>();
</script>

<template>
  <div
    :class="[
      active ? 'text-black bg-primary-800 font-semibold' : 'text-primary-900 hover:text-primary-800 hover:bg-surface-700 ',
      text ? 'px-2 py-2 gap-2.5 ' : 'p-3'
    ]"
    class="items-center gap-2 text-11px flex relative "
  >
    <component
      :is="icon"
      :class="[
        text && 'h-3 w-3 '
      ]"
    />
    <div
      v-if="text"
      class="flex flex-col gap-1"
    >
      {{ text }}
      <p 
        v-if="description"
        class="text-9px opacity-50"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="notifs"
      class="absolute top-2 right-0 transform -translate-x-1/2 p-0.5 overflow-hidden text-primary-800 font-aseprite text-7px items-center flex justify-center"
    >
      {{ notifs }}
    </div>
  </div>
</template>
