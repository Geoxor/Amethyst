<script setup lang="ts">
// @ts-ignore no types
import { LoudnessMeter } from "@domchristie/needles";
import type { Ref } from "vue";
import { onMounted, ref, watch } from "vue";

import { amethyst } from "@/amethyst.js";
import { smoothTween } from "@/logic/dom";
import { infinityClamp, mapValueToPercentage } from "@/logic/math";

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
    workerUri: new URL("../../workers/needlesWorker.js", import.meta.url).toString(),
  });

  const handleData = (event: { data: { mode: any; value: any } }) => {
    let { mode, value } = event.data;
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
    smoothTween(refToUpdate.value, value, 100, (tweenedNumber) => refToUpdate.value = tweenedNumber);
    maxRef.value < value && smoothTween (maxRef.value, value, 25, (tweenedNumber) => maxRef.value = tweenedNumber);
  };

  loudnessMeter.on("dataavailable", handleData);

  loudnessMeter.start();

  amethyst.player.on("player:resume", () => {
    if (amethyst.state.window.isFocused) {
      loudnessMeter.reset();
      loudnessMeter.resume();
      console.log("Loudness meter started");
      momentaryMax.value = MINIMUM_LUFS;
      shortTermMax.value = MINIMUM_LUFS;
      integratedMax.value = MINIMUM_LUFS;
    }
  });
  amethyst.player.on("player:pause", () => loudnessMeter.pause());

  watch(() => amethyst.state.window.isFocused, (isFocused) => {
    if (amethyst.state.settings.performance.pauseVisualsWhenUnfocused) {
      if (!isFocused) loudnessMeter.pause();
      else loudnessMeter.resume();
    }
  });
});

</script>

<template>
  <div class="leading-3 font-bold text-playback-controls-text w-full flex flex-col justify-between truncate items-start h-full disable-select no-drag">
    <div class="meter">
      <p class="type truncate text-ellipsis">
        M
      </p>
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-meter-user-defined"
          :style="`width: ${mapValueToPercentage(MINIMUM_LUFS, 0, momentary)}%`"
        />
      </div>
      <p class="value">
        {{ momentary.toFixed(2) }} LUFs
      </p>
    </div>
    <div class="meter">
      <p class="type truncate text-ellipsis">
        S
      </p>
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-meter-user-defined"
          :style="`width: ${mapValueToPercentage(MINIMUM_LUFS, 0, shortTerm)}%`"
        />
      </div>
      <p class="value">
        {{ shortTerm.toFixed(2) }} LUFs
      </p>
    </div>
    <div class="meter">
      <p class="type truncate text-ellipsis">
        I
      </p>
      <div class="barBg">
        <div
          class="bar bg-slider-fill duration-1000"
          :style="`width: ${mapValueToPercentage(MINIMUM_LUFS, 0, integrated)}%`"
        />
      </div>
      <p class="value">
        {{ integrated.toFixed(2) }} LUFs
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.meter {
  @apply flex gap-1 w-full max-h-[10px];
}
.barBg {
  @apply bg-slider-background w-3/4 truncate rounded-[2px];
}
.bar {
  @apply h-full rounded-[2px];
}

.type {
  @apply min-w-4 text-center;
}

.value {
  @apply min-w-16 text-right;
}

</style>
