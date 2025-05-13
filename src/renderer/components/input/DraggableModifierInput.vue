
<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useVModel } from "@vueuse/core";
import { computed, nextTick, ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  prefix: {
    type: String,
    default: "",
    required: false,
  },
  suffix: {
    type: String,
    default: "",
    required: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  range: {
    type: Array,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [],
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  scrollStep: {
    type: Number,
    required: false,
    default: 0,
  },
  percent: {
    type: Boolean,
    default: false,
  },
  default: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["update:modelValue"]);
const model = useVModel(props, "modelValue", emit);
const dragging = ref(false);
const modifier = ref<HTMLDivElement>();
let accumulatedDelta = 0;
let initialValue = 0;
let currentIdx = 0;

const displayValue = computed(() => {
  if (props.percent)
    return `${(model.value * 100).toFixed(0)}%`;
  return props.step < 1 ? model.value.toFixed(2) : model.value;
});
// Sets model to 0 if alt is held. Otherwise sets dragging to true.
const onMouseDown = (e: MouseEvent) => {
  checkForDoubleClick();
  if (e.altKey) resetValue();
  else {
    modifier.value?.requestPointerLock({
      unadjustedMovement: true,
    });

    modifier.value!.addEventListener("mouseup", () => document.exitPointerLock());

    currentIdx = props.range.indexOf(model.value || props.default);
    
    dragging.value = true;
    accumulatedDelta = 0;
    initialValue = model.value;
  }
};

let clicks = 0; // for checking double clicks
let timer: NodeJS.Timeout; // so it can be accessed on both clicks

const resetValue = () => model.value = props.default;

const checkForDoubleClick = () => {
  // Window to detect double click
  const DOUBLE_CLICK_DETECT_WINDOW = 300;

  timer = setTimeout(() => clicks = 0, DOUBLE_CLICK_DETECT_WINDOW);

  if (clicks == 1) {
    resetValue();
    clicks = 0;
    clearTimeout(timer);
    return;
  }

  clicks++;
};

const roundNearestStep = (value: number) => {
  return Math.ceil(value / props.step) * props.step;
};

const onMove = (e: MouseEvent) => {
  if (!dragging.value) return;
  const scale = props.max - props.min;
  const deltaY = e.movementY;
  accumulatedDelta -= deltaY;

  if (props.range.length != 0) {
    const nextValue = (props.range as number[])[Math.max(0, Math.min(props.range.length - 1, currentIdx + ~~(accumulatedDelta / 10)))];
    if (nextValue != model.value) {
      model.value = nextValue;
    }
    return;
  }

  model.value = Math.min(
    Math.max(
      initialValue + roundNearestStep(((accumulatedDelta * scale) * (props.step / 100))),
      props.min,
    ),
    props.max,
  );
};
const onMouseUp = () => {
  dragging.value = false;
};

watch(dragging, () => {
  if (dragging.value) {
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onMouseUp);
  }
  else {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
});
const pop = ref(false);
watch(model, () => {
  pop.value = true;
  setTimeout(() => pop.value = false, 100);
});

import { onClickOutside } from "@vueuse/core";

import { clamp } from "@/logic/math";
onClickOutside(modifier, () => isShowingInputElement.value = false);

const isShowingInputElement = ref(false);
const inputValue = ref(model.value);
const inputElement = ref<HTMLInputElement>();

const handleMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const step = props.scrollStep || (props.step * 10);

  let newValue = 0;
  if (e.altKey)
    delta < 0 ? newValue = model.value + step / 10 : newValue = model.value -= step / 10;
  else if (e.shiftKey)
    delta < 0 ? newValue = model.value + step * 2 : newValue = model.value -= step * 2;
  else
    delta < 0 ? newValue = model.value + step : newValue = model.value -= step;

  model.value = clamp(newValue, props.min, props.max);
};

const handleEnter = (e: KeyboardEvent) => {
  const INPUT_BEGIN_KEYS = ["-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const closeInput = () => isShowingInputElement.value = false;
  if (e.key == "Escape") closeInput();

  // Start inputif the user clicks enter, or if they already begun typing in a value
  if (e.key == "Enter" || INPUT_BEGIN_KEYS.includes(e.key) && !isShowingInputElement.value) {
    if(isShowingInputElement.value) {

      // Check if input is a number
      if (Number.isFinite(inputValue.value )) {
        // Clamp to min and max
        model.value = Math.min(props.max, Math.max(inputValue.value, props.min));
      };

      closeInput();

      // refocus on main element incase the user wants to press enter again and re-edit
      modifier.value?.focus();
    } else {

      isShowingInputElement.value = true;

      // Delay focusing because it takes some time to show the element first
      nextTick(() => {
        inputElement.value?.focus();
        inputElement.value?.select();
      });
    }
  }
};

</script>

<template>
  <button
    ref="modifier"
    class="modifier font-semibold duration-user-defined flex flex-col justify-center h-5 items-center min-w-16 leading-tight rounded-full py-1 px-2 bg-accent/15 text-accent"
    @mousedown.stop.passive="onMouseDown"
    @mouseup.stop.passive="dragging = false"
    @keydown="handleEnter"
    @wheel.stop="handleMouseScroll"
  >
    <input
      v-if="isShowingInputElement"
      ref="inputElement"
      v-model.number="inputValue"
      size="5"
      class="bg-transparent font-semibold text-center"
    >
    <template v-else>
      <icon
        icon="ic:baseline-arrow-drop-up"
        class="w-5 h-5 min-w-5 min-h-5 text-accent/25"
      />
      <div :class="{ pop }">
        <h1>
          {{ prefix }} {{ displayValue }} {{ suffix }}
        </h1>
      </div>
      <icon
        icon="ic:baseline-arrow-drop-down"
        class="w-5 h-5 min-w-5 min-h-5 text-accent/25"
      />
    </template>
  </button>
</template>

<style lang="postcss" scoped>
@keyframes popAnimation {
  from {
    transform: translateY(0px) scale(1.10);
  }

  to {
    transform: translateY(-2px) scale(1);
  }
}

.modifier {
  @apply select-none text-6px transition duration-0 transform rounded-full border-solid border-2 border-transparent;
  cursor: ns-resize;

  &:hover {
    @apply border-accent border-opacity-50;
    & > svg {
      @apply text-accent/50;
    }
  }

  &:active,
  &:focus {
    @apply border-accent;
    & > svg {
      @apply text-accent;
    }
  }

  &:active h1 {
    @apply text-accent;
  }

  & .pop {
    animation: popAnimation 1ms ease;
  }
}
</style>