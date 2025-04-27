<script lang="ts" setup>
import {useLocalStorage} from "@vueuse/core";
import type { Ref} from "vue";
import {onMounted, ref} from "vue";
import {type ResizeSide, type Direction, getResizeDirection} from ".";
import {computed} from "vue";
import ResizeHandle from "./ResizeHandle.vue";

const props = defineProps<{
  name: string;
  class?: string;
  containerClass?: string;
  side: ResizeSide;
  defaultSize?: string;
  handlesVisible?: boolean;
}>();

const direction = computed<Direction>(() => getResizeDirection(props.side));
const resizableDiv = ref() as Ref<HTMLDivElement>;
const delta = ref(0);

// number: Width in pixels, null: Default width
const storedSize = useLocalStorage<string | null>(`${props.name}-size`, null);

const isCentered = computed(
    () => props.side === "centerHorizontal" || props.side === "centerVertical"
);

function reapplySize() {
  let size: string;
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
    case "centerHorizontal":
    case "centerVertical":
      resizableDiv.value.style.flexDirection =
          props.side === "centerHorizontal" ? "column" : "row";
      resizableDiv.value.style.justifyContent = "center";
      resizableDiv.value.style.alignItems = "center";
      break;
  }
}

onMounted(() => {
  reapplySize();
  reapplyPosition();
});

function startResizing() {
  storedSize.value = (
      direction.value === "horizontal"
          ? resizableDiv.value.clientHeight
          : resizableDiv.value.clientWidth
  ).toString();
  delta.value = 0;

  reapplySize();
}

function resize(passedDelta: number, handlePosition?: string) {
  if (isCentered.value) {
    if (handlePosition === "start") {
      delta.value = -passedDelta * 2;
    } else if (handlePosition === "end") {
      delta.value = passedDelta * 2;
    }
  } else {
    if (props.side == "left" || props.side == "top") {
      delta.value = -passedDelta;
    } else {
      delta.value = passedDelta;
    }
  }

  reapplySize();
}

function stopResizing() {
  let currentStored = parseInt(storedSize.value || "x");
  if (isNaN(currentStored)) {
    currentStored = 0;
  }
  storedSize.value = (currentStored + delta.value).toString();
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
    <template
      v-if="
        props.side === 'centerHorizontal' || props.side === 'centerVertical'
      "
    >
      <resize-handle
        :direction="direction"
        :visible="!!handlesVisible"
        handle-position="start"
        @reset="resetSize"
        @start-resizing="() => startResizing()"
        @resize="(delta) => resize(delta, 'start')"
        @stop-resizing="stopResizing"
      />
      <div
        class="flex-1"
        :class="props.containerClass"
      >
        <slot />
      </div>
      <resize-handle
        :direction="direction"
        :visible="!!handlesVisible"
        handle-position="end"
        @reset="resetSize"
        @start-resizing="() => startResizing()"
        @resize="(delta) => resize(delta, 'end')"
        @stop-resizing="stopResizing"
      />
    </template>

    <template v-else>
      <resize-handle
        :direction="direction"
        :visible="!!handlesVisible"
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
    </template>
  </div>
</template>
