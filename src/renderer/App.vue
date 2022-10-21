<script setup lang="ts">
import MenuBar from "./components/MenuBar.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// Disable stupid scroll when hitting space
window.addEventListener('keydown', (e) => e.key === " " && e.target == document.body && e.preventDefault());
// @ts-ignore
document.body.style.zoom = 1.2
</script>

<template>
  <div class="flex fixed flex-col">
    <menu-bar />
    <router-view />
  </div>
</template> 

<style lang="postcss">
* {
  @apply !outline-none;
  cursor: url("./cursors/default.png"), auto !important;
}

/*  Fixes the white bg showing up when resizing */
html,
body,
#app,
#app {
  @apply bg-surface-900;
}

html,
body,
#app,
#app>div {
  @apply h-full w-full;
}

body::-webkit-scrollbar {
  display: none;
}

*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

*:hover::-webkit-scrollbar {
  overflow-y: overlay;
}

*::-webkit-scrollbar-track,
*::-webkit-scrollbar-corner {
  border-radius: 20px;
  @apply bg-surface-700;
}

*::-webkit-scrollbar-thumb {
  border-radius: 20px;
  @apply bg-surface-500;
  border: transparent;
}

.fullscreen {
  @apply fixed top-0 left-0 z-0 w-full h-full;
}

.borderRight {
  @apply border-1 border-r-[#202020] border-t-transparent border-b-transparent border-l-transparent;
}

.borderBottom {
  @apply border-1 border-b-[#202020] border-t-transparent border-r-transparent border-l-transparent;
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
