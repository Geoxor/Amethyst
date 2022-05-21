<script setup lang="ts">
import MenuBar from "./components/MenuBar.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <div class="flex flex-col">
    <menu-bar />
    <router-view />
  </div>
</template>

<style lang="postcss">
* {
  @apply !outline-none;
}
html, body, #app, #app > div {
  @apply h-full w-full ;
}

*::-webkit-scrollbar {
  width: 4px;
  height:4px;
}
*:hover::-webkit-scrollbar {
  overflow-y: overlay;
}
*::-webkit-scrollbar-track,
*::-webkit-scrollbar-corner {
  border-radius: 20px;
  @apply bg-gray-100;
}
*::-webkit-scrollbar-thumb {
  border-radius: 20px;
  @apply bg-gray-400;
  border: transparent;
}

.fullscreen {
  @apply fixed top-0 left-0 z-0 w-full h-full;
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
