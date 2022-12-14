<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{ node: AudioNode, channels: number }>();
const FLOOR = -60;
const RANGE = 30;
const FFT_SIZE = 1024;

// Tuple of insta and average per channel
const channels = [
	[ref(FLOOR), ref(FLOOR)], // left channel
	[ref(FLOOR), ref(FLOOR)], // right channel
	[ref(FLOOR), ref(FLOOR)], // center channel
	[ref(FLOOR), ref(FLOOR)], // sub channel
	[ref(FLOOR), ref(FLOOR)], // left surround channel
	[ref(FLOOR), ref(FLOOR)], // right surround channel
	[ref(FLOOR), ref(FLOOR)], // 
	[ref(FLOOR), ref(FLOOR)], // 
	[ref(FLOOR), ref(FLOOR)], // 
	[ref(FLOOR), ref(FLOOR)], // 
	[ref(FLOOR), ref(FLOOR)], // 
];

const nChannels = props.channels || 2;
const width = 4;

let shouldStopRendering = false;

onMounted(() => {
	const { context } = props.node;

	const splitter = context.createChannelSplitter(channels.length);

	const analyzers = channels.map(() => {
		const analyzer = context.createAnalyser();
		analyzer.fftSize = FFT_SIZE;
		return analyzer;
	});

	const buffers = analyzers.map(analyzer => new Float32Array(analyzer.fftSize));

	props.node.connect(splitter);
	analyzers.forEach((analyzer, i) => splitter.connect(analyzer, i, 0));

	function draw() {
		buffers.forEach((buffer, i) => analyzers[i].getFloatTimeDomainData(buffer));

		// Compute peak instantaneous power over the interval.
		let peaks = channels.map(() => 0);
		let sumOfSquares = channels.map(() => 0);

		for (let i = 0; i < buffers[0].length; i++) {
			const powers = buffers.map(buffer => buffer[i] ** 2);

			for (let k = 0; k < channels.length; k++) {
				// Average
				sumOfSquares[k] += powers[k];
				// Instantenious
				peaks[k] = Math.max(peaks[k], powers[k]);
			}
		}

		channels.forEach((channel, i) => {
			channel[0].value = 10 * Math.log10(peaks[i]);
			channel[1].value = 10 * Math.log10(sumOfSquares[i] / buffers[0].length);
		});

		!shouldStopRendering && requestAnimationFrame(draw);
	}
	draw();
});

const computedWidth = (value: number): number => {
	const width = (1 + value / RANGE) * 90;
	// this fixes the animation jump from 0 to the first value
	return Math.min(100, Math.max(0.01, width));
};

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <div
    class="relative h-full"
    :style="`width: ${(width + (width / 2)) * nChannels + 6}px`"
  >
    <div
      v-for="i of nChannels"
      :key="i"
      class="absolute h-full overflow-hidden rounded-full"
      :style="`width: ${width}px; left: ${(width * 3 / 2) * i - (width * 3 / 2)}px;`"
    >
      <div
        :style="`width: ${width}px;`"
        class="absolute top-0 left-0 bg-surface-600 h-full rounded-full"
      />
      <div
        :style="`width: ${width}px;`"
        class="absolute bottom-0 bg-surface-500 h-90/100 rounded-full"
      />

      <div
        :class="channels[i - 1][0].value > 0 ? 'bg-rose-600' : 'bg-green-600'"
        class="rounded-full duration-50 transition-all absolute bottom-0"
        :style="`width: ${width}px; height: ${computedWidth(channels[i - 1][0].value)}%`"
      />
      <div
        :class="channels[i - 1][0].value > 0 ? 'bg-rose-500' : 'bg-green-500'"
        class="absolute duration-50 transition-all bottom-0 rounded-full"
        :style="`width: ${width}px; height: ${computedWidth(channels[i - 1][1].value)}%`"
      />
    </div>

    <svg
      class="absolute h-full stroke-3px w-4px"
      :style="`left: ${((width + 2) * nChannels + 1)}px;`"
    >
      <line
        class="stroke-cap-round stroke-surface-500"
        x1="2"
        y1="2"
        x2="2"
        y2="100"
      />
    </svg>
  </div>
</template>

<style scoped>
svg {
	stroke-width: 3px;
}

line {
	stroke-dasharray: 0 8;
}
</style>