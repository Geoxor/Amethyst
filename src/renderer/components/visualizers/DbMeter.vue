<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
const props = defineProps<{ node: AudioNode, channels?: number, pre?: boolean }>();
const FLOOR = -120;
const MAX_CHANNELS = 16;
const currentChannels = computed(() => props.channels || 2);
const width = 4;

let shouldStopRendering = false;

const channelData = Array.from({ length: MAX_CHANNELS }, () => [ref(FLOOR), ref(FLOOR)]);

onMounted(() => {
  const { context } = props.node;

  const splitter = context.createChannelSplitter(MAX_CHANNELS);
  const analyzers = Array.from({ length: MAX_CHANNELS }, () => {
    const analyzer = context.createAnalyser();
    analyzer.fftSize = amethyst.state.settings.metering.decibelMeter.fftSize;
    return analyzer;
  });

  let buffers = analyzers.map(analyzer => new Float32Array(analyzer.fftSize));
  
  watch(() => amethyst.state.settings.metering.decibelMeter.fftSize, value => {
    analyzers.forEach(a => a.fftSize = value);
    buffers = analyzers.map(() => new Float32Array(value));
  });

  watch(() => amethyst.state.window.isFocused, isFocused => {
    if (amethyst.state.settings.performance.pauseVisualsWhenUnfocused) {
      if (!isFocused) shouldStopRendering = true;
      else {
        shouldStopRendering = false;
        draw();
      }
    }
  });

  props.node.connect(splitter);
  analyzers.forEach((analyzer, i) => splitter.connect(analyzer, i, 0));

  function draw() {
    buffers.forEach((buffer, i) => analyzers[i].getFloatTimeDomainData(buffer));

    const peaks = Array.from({ length: MAX_CHANNELS }, () => 0);
    const sumOfSquares = Array.from({ length: MAX_CHANNELS }, () => 0);

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

const computedWidth = (value: number): number => {
  const width = (1 + value / Math.abs(amethyst.state.settings.metering.decibelMeter.minimumDb)) * 90;
  return Math.min(100, Math.max(0.01, width));
};

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <div class="flex flex-col gap-0.5 items-center  h-full">
    <div
      class="relative h-full"
      :style="`
			width: ${(width + (width / 2)) * (currentChannels) + currentChannels}px;
			min-width: ${(width + (width / 2)) * (currentChannels) + currentChannels}px;
		`"
    >
      <div
        v-for="i of currentChannels"
        :key="i"
        class="absolute h-full overflow-hidden rounded-full"
        :style="`width: ${width}px; left: ${(width * 1.75) * i - (width * 1.75)}px;`"
      >
        <div
          :style="`width: ${width}px;`"
          class="absolute top-0 left-0 bg-slider-background h-full rounded-full"
        />
        <div
          :style="`width: ${width}px;`"
          class="absolute bottom-0 bg-slider-background h-90/100 rounded-full"
        />

        <div
          :class="channelData[i - 1][0].value > 0 ?'bg-rose-600' : 'bg-slider-fill/80'"
          class="rounded-full transition-all duration-meter-user-defined absolute bottom-0"
          :style="`width: ${width}px; height: ${computedWidth(channelData[i - 1][0].value)}%`"
        />
        <div
          :class="channelData[i - 1][0].value > 0 ? 'bg-rose-500' : 'bg-accent'"
          class="absolute transition-all duration-meter-user-defined bottom-0 rounded-full"
          :style="`width: ${width}px; height: ${computedWidth(channelData[i - 1][1].value)}%`"
        />
      </div>

      <svg
        class="absolute h-full stroke-3px w-4px"
        :style="`left: ${((width + 2) * currentChannels + currentChannels)}px;`"
      >
        <line
          class="stroke-cap-round stroke-slider-fill"
          x1="2"
          y1="2"
          x2="2"
          y2="100"
        />
      </svg>
    </div>
    <div
      v-if="pre"
      class="div text-surface-600 w-min font-aseprite text-7px pl-0.7 bg-accent py-1 px-0.25 rounded-2px flex items-center justify-center"
    >
      PRE
    </div>
    <div
      v-else-if="amethyst.state.settings.metering.decibelMeter.separatePrePost"
      class="div text-surface-600 w-min font-aseprite text-7px pl-0.7 bg-inspector-color py-1 px-0.25 rounded-2px flex items-center justify-center"
    >
      POST
    </div>
  </div>
</template>

<style scoped>
svg {
	stroke-width: 3px;
}

line {
	stroke-dasharray: 0 9;
}
</style>