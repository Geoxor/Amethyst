<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { type Direction } from ".";

const emit = defineEmits<{
  (e: "reset"): void;
  (e: "startResizing"): void;
  (e: "resize", delta: number): void;
  (e: "stopResizing"): void;
}>();

const props = defineProps<{
  direction: Direction;
  handlePosition?: string;
  class?: string;
  visible: boolean;
}>();

const resizing = ref(false);
const offset = ref(0);

function getDefiningMeasure(event: MouseEvent): number {
  return props.direction === "horizontal" ? event.clientY : event.clientX;
}

function onMouseMove(event: MouseEvent) {
  if (!resizing.value) return;
  event.preventDefault();
  const newOffset = getDefiningMeasure(event);
  const delta = newOffset - offset.value;
  emit("resize", delta);
}

function onMouseDown(event: MouseEvent) {
  event.preventDefault();
  resizing.value = true;
  offset.value = getDefiningMeasure(event);
  emit("startResizing");
}

function onMouseUp() {
  if (!resizing.value) return;
  resizing.value = false;
  offset.value = 0;
  emit("stopResizing");
}

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
});

// Determine the cursor style based on direction and handle position
const cursorClass = computed(() => {
  if (props.direction === "horizontal") {
    return "handle-horizontal";
  } else {
    return "handle-vertical";
  }
});

const handlePositionClass = computed(() => {
  if (props.direction === "horizontal") {
    return "handle-position-horizontal";
  } else {
    return "handle-position-vertical";
  }
});
</script>

<template>
  <div
    class="relative"
    :class="handlePositionClass"
  >
    <button
      class="flex items-center justify-center p-[4px]"
      :class="[cursorClass, props.class, props.visible && 'absolute top-0 left-0']"
      @dblclick="emit('reset')"
      @mousedown="onMouseDown"
      @click.stop
    >
      <div
        v-if="props.visible"
        class="border-r border-r-surface-500 pointer-events-none"
        :class="[
          props.direction === 'horizontal'
            ? 'handle-horizontal-thumb'
            : 'handle-vertical-thumb',
        ]"
      />
    </button>
  </div>
</template>

<style scoped>
@import "../../base.css";

.handle-horizontal {
  cursor: ns-resize !important;
  width: 100%;
  height: 10px;
}

.handle-horizontal-thumb {
  width: 5em;
  height: 100%;
}

.handle-vertical {
  cursor: ew-resize !important;
  height: 100%;
  width: 10px;
}

.handle-vertical-thumb {
  height: 5em;
  width: 100%;
}

.handle-position-horizontal {
  width: 100%;
  height: 0;
}

.handle-position-vertical {
  width: 0;
  height: 100%;
}
</style>
