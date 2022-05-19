<script setup lang="ts">
import MenuBar from "./components/MenuBar.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <div>
    <menu-bar />
    <router-view />
  </div>
</template>

<style lang="postcss">
* {
  @apply !outline-none;
}
html {
  @apply h-full w-full;
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
