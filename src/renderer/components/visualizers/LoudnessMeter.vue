<script setup lang="ts">
import { Ref, onMounted, ref, watch } from "vue";
// @ts-ignore no types
import { amethyst, useState } from "@/amethyst";
import { smoothTween } from "@/logic/dom";
import { computeWidthPercentage, infinityClamp } from "@/logic/math";
import { LoudnessMeter } from "@domchristie/needles";

const props = defineProps<{ node: AudioNode }>();

const MINIMUM_LUFS = -20;

const 
  shortTerm = ref(MINIMUM_LUFS),
  momentary = ref(MINIMUM_LUFS),
  integrated = ref(MINIMUM_LUFS),
  momentaryMax = ref(MINIMUM_LUFS),
  shortTermMax = ref(MINIMUM_LUFS),
  integratedMax = ref(MINIMUM_LUFS);

onMounted(() => {

  const loudnessMeter = new LoudnessMeter({
    source: props.node,
    // @ts-ignore
    workerUri: new URL("../../workers/needlesWorker.js", import.meta.url).toString()
  });

  const handleData = (event: { data: { mode: any; value: any; }}) => {
    let {mode, value} = event.data;
    let refToUpdate: Ref<number>;
    let maxRef: Ref<number>;

    switch (mode) {
      case "momentary":
        refToUpdate = momentary;
        maxRef = momentaryMax;
        break;
      case "short-term":
        refToUpdate = shortTerm;
        maxRef = shortTermMax;
        break;
      case "integrated":
        refToUpdate = integrated;
        maxRef = integratedMax;
        break;
      default:
        return;
    }

    value = infinityClamp(value, MINIMUM_LUFS);
    smoothTween(refToUpdate.value, value, 100, (tweenedNumber => refToUpdate.value = tweenedNumber));
    maxRef.value < value && smoothTween (maxRef.value, value, 25, (tweenedNumber => maxRef.value = tweenedNumber));
  };

  loudnessMeter.on("dataavailable", handleData);

  loudnessMeter.start();

  amethyst.player.on("play", () => {
    if (useState().state.isFocused) {
      loudnessMeter.reset();
      loudnessMeter.resume();
      momentaryMax.value = MINIMUM_LUFS;
      shortTermMax.value = MINIMUM_LUFS;
      integratedMax.value = MINIMUM_LUFS;
    }
  });
  amethyst.player.on("pause", () => loudnessMeter.pause());

  watch(() => useState().state.isFocused, isFocused => {
    if (useState().settings.value.pauseVisualsWhenUnfocused) {
      if (!isFocused) loudnessMeter.pause();
      else loudnessMeter.resume();
    }
  });
});

</script>

<template>
  <div class="text-10px font-bold text-playback-controls-text w-full flex flex-col justify-between items-center h-full py-0.5 disable-select no-drag">
    <div class="meter">
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-100"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, momentary)}%`"
        />
      </div>
      
      <div class="flex justify-between w-full">
        <p class="type overflow-hidden overflow-ellipsis">
          Momentary
        </p>
        <div class="value">
          <p>
            {{ momentary.toFixed(2) }} LUFs
          </p>
        </div>
      </div>
    </div>
    <div class="meter">
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-100"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, shortTerm)}%`"
        />
      </div>
      <div class="flex justify-between w-full">
        <p class="type overflow-hidden overflow-ellipsis">
          Short-term
        </p>
        <div class="value">
          <p>
            {{ shortTerm.toFixed(2) }} LUFs
          </p>
        </div>
      </div>
    </div>
    <div class="meter">
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-1000"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, integrated)}%`"
        />
      </div>
      <div class="flex justify-between w-full">
        <p class="type overflow-hidden overflow-ellipsis">
          Integrated
        </p>
        <div class="value">
          <p>
            {{ integrated.toFixed(2) }} LUFs
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.meter {
  @apply flex gap-1.5 w-full;
}
.barBg {
  @apply bg-slider-background w-full overflow-hidden rounded-2px;
}
.bar {
  @apply h-full rounded-2px ;
}

.value {
  @apply flex;
  p {
    @apply w-14;
    text-align: end;
  }
}

</style>