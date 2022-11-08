<script lang="ts" setup>
import { Ref, ref } from "vue";
let startX = 0, startWidth = 0;

const isHoveringOverResizeBoundary = ref(false);
const isResizing = ref(false);

const resizableDiv = ref() as Ref<HTMLDivElement>;
const handleMouseDown = (e: MouseEvent) => {
  startWidth = resizableDiv.value.getBoundingClientRect().width;
  startX = e.clientX;
  isResizing.value = true;
  if (startWidth - e.offsetX < 12) {
    document.addEventListener("mousemove", resize, false);
    document.addEventListener(
      "mouseup",
      function () {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", resize, false);
      },
      false
    );
  }
};

const handleMouseOver = (e: MouseEvent) => {
  const width = resizableDiv.value.getBoundingClientRect().width;
  if (width - e.offsetX < 12) {
    return isHoveringOverResizeBoundary.value = true;
  }
  return isHoveringOverResizeBoundary.value = false;
};

function resize(e: MouseEvent) {
  // if (e.x < MINIMUM_WIDTH + 40 || e.x > MAXIMUM_WIDTH - 32) return;
  const newWidth = (startWidth + e.clientX - startX);
  if (newWidth < 128) return;
  resizableDiv.value.style.width = newWidth + "px";
}
</script>
<template>
  <div
    ref="resizableDiv"
    class="resizableDiv max-w-80vw pr-2 border-r-2 border-transparent select-none h-full"
    :class="[isHoveringOverResizeBoundary && 'border-r-primary-700']"
    @mousedown="handleMouseDown"
    @mouseup="isResizing = false"
    @mouseover="handleMouseOver"
    @mouseleave="isHoveringOverResizeBoundary = false"
  >
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.resizableDiv {
  cursor: ew-resize !important;
}
</style>