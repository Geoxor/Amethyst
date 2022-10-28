<template>
  <div
    ref="resizableDiv"
    class="resizableDiv w-full pr-2 border-r-2 border-transparent h-full"
    :class="[isHoveringOverResizeBoundary && 'border-r-primary-800']"
    @mousedown="handleMouseDown"
    @mouseup="isResizing = false"
    @mouseover="handleMouseOver"
    @mouseleave="isHoveringOverResizeBoundary = false"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
let mousePosition = 0;

const isHoveringOverResizeBoundary = ref(false);
const isResizing = ref(false);

const MINIMUM_WIDTH = 128;
const MAXIMUM_WIDTH = 384;

const resizableDiv = ref<HTMLDivElement>();
const handleMouseDown = (e: MouseEvent) => {
  const width = resizableDiv.value!.getBoundingClientRect().width;
  isResizing.value = true;
  if (width - e.offsetX < 12) {
    mousePosition = e.x;
    isHoveringOverResizeBoundary.value = true;
    document.addEventListener("mousemove", resize, false);
    document.addEventListener(
      "mouseup",
      function () {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", resize, false);
      },
      false
    );
    return;
  }
  return isHoveringOverResizeBoundary.value = false;
};

const handleMouseOver = (e: MouseEvent) => {
  const width = resizableDiv.value!.getBoundingClientRect().width;
  if (width - e.offsetX < 12) {
    return isHoveringOverResizeBoundary.value = true;
  }
  return isHoveringOverResizeBoundary.value = false;
};

function resize(e: MouseEvent) {
  if (e.x < MINIMUM_WIDTH + 40 || e.x > MAXIMUM_WIDTH - 32) return;
  const dx = e.x - mousePosition;
  mousePosition = e.x;
  resizableDiv.value!.style.width = Math.max(MINIMUM_WIDTH, parseInt(getComputedStyle(resizableDiv.value!, "").width) + dx) + "px";
}
</script>

<style lang="postcss" scoped>
.resizableDiv {
  cursor: ew-resize !important;
}
</style>