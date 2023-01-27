<script setup lang="ts">
import { onMounted, ref } from "vue";
// @ts-ignore no types
import { LoudnessMeter } from "@domchristie/needles";
import { player } from "@/logic/player";

const props = defineProps<{ node: AudioNode }>();

const MINIMUM_LUFS = -20;

const shortTerm = ref(MINIMUM_LUFS);
const momentary = ref(MINIMUM_LUFS);
const integrated = ref(MINIMUM_LUFS);

const momentaryMax = ref(MINIMUM_LUFS);
const shortTermMax = ref(MINIMUM_LUFS);
const integratedMax = ref(MINIMUM_LUFS);

onMounted(() => {

  const infinityClamp = (num: number, min: number) => Number.isFinite(num) ? num : min;

  const loudnessMeter = new LoudnessMeter({
    source: props.node,
    workerUri: new URL("../../workers/needlesWorker.js", import.meta.url).toString()
  });

  loudnessMeter.on("dataavailable", function (event) {
    let {mode, value} = event.data; // momentary | short-term | integrated

    value = infinityClamp(value, MINIMUM_LUFS);

    switch (mode) {
      case "momentary":
        momentary.value = value;
        momentaryMax.value < value && (momentaryMax.value = value);
        break;
      case "short-term":
        shortTerm.value = value;
        shortTermMax.value < value && (shortTermMax.value = value);
        break;
      case "integrated":
        integrated.value = value;
        integratedMax.value < value && (integratedMax.value = value);
        break;
      default:
        break;
    }
    
  });

  loudnessMeter.start();

  player.on("play", () => {
    loudnessMeter.resume();
    // Reset max values on play
    momentaryMax.value = MINIMUM_LUFS;
    shortTermMax.value = MINIMUM_LUFS;
    integratedMax.value = MINIMUM_LUFS;
    integrated.value = MINIMUM_LUFS;
  });
  player.on("pause", () => loudnessMeter.pause());
});

const computeWidth = (value: number): number => {
  const MAX = 0;
  const MIN = MINIMUM_LUFS;
  if (value < MINIMUM_LUFS) return 0; // if below threashold don't default to 100
  return ((value - MIN) / (MAX - MIN)) * 100;
};

</script>

<template>
  <div class="font-aseprite text-primary-900 w-full max-w-40 flex flex-col justify-between h-full py-0.5">
    <div class="meter">
      <div class="barBg">
        <div
          class="bar"
          :style="`width: ${computeWidth(momentary)}%`"
        />
      </div>
      
      <div class="flex justify-between w-full">
        <p class="type">
          Momentary
        </p>
        <p class="value">
          <span class="text-primary-900 text-opacity-50">max {{ momentaryMax.toFixed(2) }} </span> {{ momentary.toFixed(2) }} LUFs
        </p>
      </div>
    </div>
    <div class="meter">
      <div class="barBg">
        <div
          class="bar"
          :style="`width: ${computeWidth(shortTerm)}%`"
        />
      </div>
      <div class="flex justify-between w-full">
        <p class="type">
          Short-term
        </p>
        <p class="value">
          <span class="text-primary-900 text-opacity-50">max {{ shortTermMax.toFixed(2) }} </span> {{ shortTerm.toFixed(2) }} LUFs
        </p>
      </div>
    </div>
    <div class="meter">
      <div class="barBg">
        <div
          class="bar"
          :style="`width: ${computeWidth(integrated)}%`"
        />
      </div>
      <div class="flex justify-between w-full">
        <p class="type">
          Integrated
        </p>
        <p class="value">
          <span class="text-primary-900 text-opacity-50">max {{ integratedMax.toFixed(2) }} </span> {{ integrated.toFixed(2) }} LUFs
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.meter {
  @apply flex flex-col gap-1.5;
}
.barBg {
  @apply bg-surface-600 w-full overflow-hidden rounded-2px;
}
.bar {
  @apply h-1 duration-250 rounded-2px bg-cyan-400;
}

</style>