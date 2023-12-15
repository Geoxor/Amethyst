<script setup lang="ts">
import { useState } from "@/amethyst";
import { onMounted, onUnmounted, ref, watch } from "vue";
const props = defineProps<{ node: AudioNode }>();
const FLOOR = -120;
const CHANNELS = 16;
const width = 10;

let shouldStopRendering = false;

const channelData = Array.from({ length: CHANNELS }, () => [ref(FLOOR), ref(FLOOR)]);

const CHANNEL_NAMES = [
  "L",
  "R",
  "C",
  "LFE",
  "Ls",
  "Rs",
  "Lrs",
  "Rrs",
  "Lw",
  "Rw",
  "Ltf",
  "Rtf",
  "Ltm",
  "Rtm",
  "Ltr",
  "Rtr"
];

onMounted(() => {
  const { context } = props.node;

  const splitter = context.createChannelSplitter(CHANNELS);
  const analyzers = Array.from({ length: CHANNELS }, () => {
    const analyzer = context.createAnalyser();
    analyzer.fftSize = useState().settings.value.decibelMeterFftSize;
    return analyzer;
  });

  let buffers = analyzers.map(analyzer => new Float32Array(analyzer.fftSize));
  
  watch(() => useState().settings.value.decibelMeterFftSize, value => {
    analyzers.forEach(a => a.fftSize = value);
    buffers = analyzers.map(() => new Float32Array(value));
  });

  props.node.connect(splitter);
  analyzers.forEach((analyzer, i) => splitter.connect(analyzer, i, 0));

  function draw() {
    buffers.forEach((buffer, i) => analyzers[i].getFloatTimeDomainData(buffer));

    const peaks = Array.from({ length: CHANNELS }, () => 0);
    const sumOfSquares = Array.from({ length: CHANNELS }, () => 0);

    for (let i = 0; i < buffers[0].length; i++) {
      const powers = buffers.map(buffer => buffer[i] ** 2);
      powers.forEach((power, k) => {
        sumOfSquares[k] += power;
        peaks[k] = Math.max(peaks[k], power);
      });
    }

    channelData.forEach((channel, i) => {
      channel[0].value = 10 * Math.log10(peaks[i]);
      channel[1].value = 10 * Math.log10(sumOfSquares[i] / buffers[0].length);
    });

    !shouldStopRendering && requestAnimationFrame(draw);
  }
  draw();
});

const computedHeight = (value: number): number => {
  const width = (1 + value / Math.abs(useState().settings.value.decibelMeterMinimumDb)) * 90;
  return Math.min(100, Math.max(0.01, width));
};

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <div class="flex h-full w-full p-2 flex gap-1">
    <div
      v-for="i of CHANNELS"
      :key="i"
      class="flex flex-col gap-2 h-full items-center"
    >
      <div
        class="relative h-full overflow-hidden rounded-2px flex gap-2"
        :style="`width: ${width}px;`"
      >
        <div
          :style="`width: ${width}px;`"
          class="absolute top-0 left-0 bg-surface-700 h-full rounded-2px"
        />
        <div
          :style="`width: ${width}px;`"
          class="absolute bottom-0 bg-surface-600 h-90/100 rounded-2px"
        />

        <div
          :class="channelData[i - 1][0].value > 0 ? 'bg-rose-600' : 'bg-accent bg-opacity-50'"
          class="rounded-2px duration-100 transition-all absolute bottom-0"
          :style="`width: ${width}px; height: ${computedHeight(channelData[i - 1][0].value)}%`"
        />
        <div
          :class="channelData[i - 1][0].value > 0 ? 'bg-rose-500' : 'bg-accent'"
          class="absolute duration-100 transition-all bottom-0 rounded-2px"
          :style="`width: ${width}px; height: ${computedHeight(channelData[i - 1][1].value)}%`"
        />
      </div>
      <div class="w-8 h-8 max-h-8 max-h-8 min-h-8 min-w-8 rounded-4px bg-surface-700 text-text_title text-10px flex items-center justify-center">
        <p>{{ isFinite(channelData[i - 1][0].value) ? channelData[i - 1][0].value.toFixed(1) : '-∞' }}</p>
      </div>
      <div class="w-8 h-8 max-h-8 max-h-8 min-h-8 min-w-8 rounded-4px text-text_subtitle text-13px flex items-center justify-center">
        <p>{{ CHANNEL_NAMES[i - 1] }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
	stroke-width: 4px;
}

line {
	stroke-dasharray: 0 128;
}
</style>