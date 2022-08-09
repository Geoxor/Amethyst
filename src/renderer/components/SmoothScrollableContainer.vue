<template>
  <div id="wrapper" ref="wrapper">
    <div id="smoothScrollableContainer" ref="smoothScrollableContainer">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from '../amethyst.js';
import { onMounted, Ref, ref } from 'vue';
const body = document.body;
const wrapper = ref() as Ref<HTMLDivElement>;
const smoothScrollableContainer = ref() as Ref<HTMLDivElement>;
const state = useState();

// Temporary fix cus otherwise we are 72px short
// TODO: should use the parents height instead
const MENU_CONTAINER_HEIGHT = 72

let sy = 0;
let dy = sy;

function render() {
  //We calculate our container position by linear interpolation method
  dy = li(dy, sy, state.settings.smoothScrollSpeed);
  dy = ~~(dy * 100) / 100;

  smoothScrollableContainer.value.style.transform = `translate3d(${0}px, -${dy}px, 0px)`;
  window.requestAnimationFrame(render);
}

onMounted(() => {
  new ResizeObserver(() => {
    sy = 0;
    dy = sy;
  }).observe(wrapper.value);
})

function li(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function easeScroll(e: WheelEvent) {
  const delta = e.deltaY;

  // only scroll if the container is taller than the window height
  if (smoothScrollableContainer.value.offsetHeight > window.innerHeight + MENU_CONTAINER_HEIGHT) {
    // check if reached the bottom of the container
    if (sy + window.innerHeight >= smoothScrollableContainer.value.offsetHeight && delta > 0) {
      sy = smoothScrollableContainer.value.offsetHeight - window.innerHeight + MENU_CONTAINER_HEIGHT;
    }
    else {
      sy = Math.max(0, sy + (e.deltaY / 2));
    }
  }
}

onMounted(() => {

  // TODO: this is stupid, it makes the body of the entire page be the total length of the list
  // TODO: so it lets you transform all the way down, replace this with something smarter
  // TODO: so we dont have to hide the scrollbar from the body
  body.style.height = wrapper.value.clientHeight + 'px';

  // Bind a scroll function
  wrapper.value.addEventListener('wheel', easeScroll);
  window.requestAnimationFrame(render);
})

</script>