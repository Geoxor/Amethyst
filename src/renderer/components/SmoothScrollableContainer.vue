<template>
  <div id="smoothScrollableContainer" ref="smoothScrollableContainer">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useState } from '../amethyst.js';
import { onMounted, Ref, ref } from 'vue';
const body = document.body;
const smoothScrollableContainer = ref() as Ref<HTMLDivElement>;
const state = useState();

let sy = 0;
let dy = sy;

function render() {
  //We calculate our container position by linear interpolation method
  dy = li(dy, sy, state.settings.smoothScrollSpeed);

  dy = ~~(dy * 100) / 100;

  smoothScrollableContainer.value.style.transform = `translate3d(${0}px, -${dy}px, 0px)`;

  window.requestAnimationFrame(render);
}

function li(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function easeScroll(e: WheelEvent) {
  sy = Math.max(0, sy + (e.deltaY / 2));
}

onMounted(() => {

  // TODO: this is stupid, it makes the body of the entire page be the total length of the list
  // TODO: so it lets you transform all the way down, replace this with something smarter
  // TODO: so we dont have to hide the scrollbar from the body
  body.style.height = smoothScrollableContainer.value.clientHeight + 'px';

  // Bind a scroll function
  window.addEventListener('wheel', easeScroll);
  window.requestAnimationFrame(render);
})



</script>

<style scoped lang="postcss">
::-webkit-scrollbar {
  width: 0 !important;
}

#smoothScrollableContainer {
  @apply fixed z-20;
}
</style>