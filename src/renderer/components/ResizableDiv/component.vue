<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import { onMounted, Ref, ref } from "vue";
import { type Side, type Direction, getResizeDirection } from ".";
import { computed } from "vue";
import ResizeHandle from "./ResizeHandle.vue";

const props = defineProps<{
  name: string;
  class?: string;
  containerClass?: string;
  side: Side;
  defaultSize?: string;
}>();

const direction = computed<Direction>(() => getResizeDirection(props.side));
const resizableDiv = ref() as Ref<HTMLDivElement>;
const delta = ref(0);

// number: Width in pixels, null: Default width
const storedSize = useLocalStorage<string | null>(`${props.name}-size`, null);

function reapplySize() {
  let size = "";
  if (storedSize.value != null) {
    size = storedSize.value + "px";
  } else {
    size = props.defaultSize || "100%";
  }

  size = `calc(${size} + ${delta.value}px)`;

  if (direction.value === "horizontal") {
    resizableDiv.value.style.height = size;
  } else {
    resizableDiv.value.style.width = size;
  }
}

function reapplyPosition() {
  switch (props.side) {
    case "left":
      resizableDiv.value.style.flexDirection = "row";
      break;
    case "right":
      resizableDiv.value.style.flexDirection = "row-reverse";
      break;

    case "top":
      resizableDiv.value.style.flexDirection = "column";
      break;
    case "bottom":
      resizableDiv.value.style.flexDirection = "column-reverse";
      break;
  }
}

onMounted(() => {
  reapplySize();
  reapplyPosition();
});

function startResizing() {
  storedSize.value = direction.value === "horizontal" ? resizableDiv.value.clientHeight : resizableDiv.value.clientWidth;

  delta.value = 0;
  reapplySize();
}

function resize(passedDelta: number) {
  if (props.side == "left" || props.side == "top") {
    delta.value = -passedDelta;
  } else {
    delta.value = passedDelta;
  }
  reapplySize();
}

function stopResizing() {
  if (storedSize.value != null) {
    let currentStored = parseInt(storedSize.value);
    if (isNaN(currentStored)) {
      currentStored = 0;
    }
    storedSize.value = currentStored + delta.value;
  }
  delta.value = 0;
  reapplySize();
}

function resetSize() {
  storedSize.value = null;
  delta.value = 0;
  reapplySize();
}
</script>

<template>
  <div
    ref="resizableDiv"
    class="flex"
    :class="props.class"
  >
    <resize-handle
      :direction="direction"
      @reset="resetSize"
      @start-resizing="startResizing"
      @resize="resize"
      @stop-resizing="stopResizing"
    />
    <div
      class="flex-1"
      :class="props.containerClass"
    >
      <slot />
    </div>
  </div>
</template>
