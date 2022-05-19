<script lang="ts" setup>
const invoke = window.electron.ipcRenderer.invoke;
</script>

<template>
  <div class="flex text-black no-drag">
    <button class="controlButton hover:bg-blue-400 active:bg-blue-500" @click="invoke('minimize')">
      <i-fluency-minimize />
    </button>

    <button class="controlButton hover:bg-blue-400 active:bg-blue-500" @click="invoke('maximize')">
      <i-fluency-maximize />
    </button>

    <button class="controlButton hover:bg-red-500 active:bg-red-400" @click="invoke('close')">
      <i-fluency-x />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.controlButton {
  @apply hover:text-white h-full flex items-center justify-center py-1.5 px-4 text-sm;

  svg {
    @apply w-3 h-3;
  }
}
</style>
