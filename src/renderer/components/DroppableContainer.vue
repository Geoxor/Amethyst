<script setup lang="ts">
import { ref } from "vue";

const dropable = ref();
// This counter fixes border disappearing when hovering over child components of dragevent
let counter = 0;

const handleDragEnter = () => {
  counter++;
  dropable.value.classList.add("dragging");
};

const handleDragLeave = () => {
  counter--;
  if (counter === 0) dropable.value.classList.remove("dragging");
};

const handleDrop = () => {
  counter = 0;
  dropable.value.classList.remove("dragging");
};

const handleDragEnd = () => {
  counter = 0;
  dropable.value.classList.remove("dragging");
};

</script>

<template>
  <div
    ref="dropable"
    class="border-transparent border-dashed border-2"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @dragend.prevent="handleDragEnd"
  >
    <slot />
  </div>
</template>

<style scoped lang="postcss">

.dragging {
  @apply border-primary-800;
}
</style>