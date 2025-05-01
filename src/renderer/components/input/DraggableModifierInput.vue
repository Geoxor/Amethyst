
<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useVModel } from "@vueuse/core";
import { computed, ref, watch } from "vue";
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
let startY = 0;
let initialValue = 0;
let currentIdx = 0;

const displayValue = computed(() => {
  if (props.percent)
    return `${(model.value * 100).toFixed(0)}%`;
  return props.step < 1 ? model.value.toFixed(2) : model.value;
});
// Sets model to 0 if alt is held. Otherwise sets dragging to true.
const onMouseDown = (e: MouseEvent) => {
  if (e.altKey) {
    model.value = props.default;
  }
  else {
    currentIdx = props.range.indexOf(model.value || props.default);
    
    dragging.value = true;
    startY = e.clientY;
    initialValue = model.value;
  }
};
const roundNearestStep = (value: number) => {
  return Math.ceil(value / props.step) * props.step;
};

const onMove = (e: MouseEvent) => {
  if (!dragging.value) return;
  const scale = props.max - props.min;
  const distance = startY - e.clientY;

  if (props.range.length != 0) {
    const nextValue = (props.range as number[])[Math.max(0, Math.min(props.range.length - 1, currentIdx + ~~(distance / 10)))];
    if (nextValue != model.value) {
      model.value = nextValue;
    }
    return;
  }

  model.value = Math.min(
    Math.max(
      initialValue + roundNearestStep(((distance * scale) * (props.step / 100))),
      props.min,
    ),
    props.max,
  );
};
const onMouseUp = () => {
  dragging.value = false;
  startY = model.value;
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
</script>

<template>
  <div
    class="modifier font-semibold duration-user-defined flex flex-col justify-center h-5 items-center w-16 leading-tight rounded-full py-1 px-2 bg-accent text-accent bg-opacity-15"
    @mousedown.stop.passive="onMouseDown"
    @mouseup.stop.passive="dragging = false"
  >
    <icon
      icon="ic:baseline-arrow-drop-up"
      class="w-5 h-5 min-w-5 min-h-5"
    />
    <div :class="{ pop }">
      <h1>
        {{ prefix }} {{ displayValue }} {{ suffix }}
      </h1>
    </div>
    <icon
      icon="ic:baseline-arrow-drop-down"
      class="w-5 h-5 min-w-5 min-h-5"
    />
  </div>
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
  @apply select-none text-12px transition duration-0 transform rounded-full border-2 border-transparent;
  cursor: ns-resize;

  &:active,
  &:focus {
    @apply border-2 border-accent;
  }

  &:active h1 {
    @apply text-accent;
  }

  & .pop {
    animation: popAnimation 25ms ease;
  }
}
</style>