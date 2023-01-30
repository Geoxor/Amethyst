<script setup lang="ts">
import { onMounted, ref } from "vue";
// @ts-ignore no types
import { LoudnessMeter } from "@domchristie/needles";
import { player } from "@/logic/player";
import { infinityClamp, computeWidthPercentage } from "@/logic/math";

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
    let refToUpdate;
    let maxRef;

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
    refToUpdate.value = value;
    maxRef.value < value && (maxRef.value = value);
  };

  loudnessMeter.on("dataavailable", handleData);

  loudnessMeter.start();

  player.on("play", () => {
    loudnessMeter.reset();
    loudnessMeter.resume();
  });
  player.on("pause", () => loudnessMeter.pause());
});

</script>

<template>
  <div class="font-aseprite text-primary-900 w-full max-w-40 flex flex-col justify-between h-full py-0.5">
    <div class="meter">
      <div class="barBg">
        <div
          class="bar bg-cyan-400 duration-150"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, momentary)}%`"
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
          class="bar bg-cyan-400 duration-500"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, shortTerm)}%`"
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
          class="bar bg-cyan-400 duration-1000"
          :style="`width: ${computeWidthPercentage(MINIMUM_LUFS, 0, integrated)}%`"
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
  @apply h-1 rounded-2px ;
}

</style>