<script setup lang="ts">
import { usePlayer } from "../amethyst";
import { onMounted, onUnmounted, ref, computed } from "vue";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();

const FLOOR = -60;
const RANGE = 30;
const FFT_SIZE = 2048 * 2;

const player = usePlayer();
const metadata = computed(() => player.state.currentlyPlayingMetadata);

// Tuple of insta and average per channel
const channels = [
	[ref(FLOOR), ref(FLOOR)], // left channel
	[ref(FLOOR), ref(FLOOR)], // right channel
	[ref(FLOOR), ref(FLOOR)], // center channel
	[ref(FLOOR), ref(FLOOR)], // sub channel
	[ref(FLOOR), ref(FLOOR)], // left surround channel
	[ref(FLOOR), ref(FLOOR)], // right surround channel
]

let shouldFuckOff = false;

const calculatePeaks = (value: number): number => 10 * Math.log10(value);

onMounted(() => {
	const context = props.node.context;

	const splitter = context.createChannelSplitter(channels.length);

	const analyzers = channels.map(() => {
		const analyzer = context.createAnalyser()
		analyzer.fftSize = FFT_SIZE;
		return analyzer;
	})

	// Time domain samples are always provided with the count of
	// fftSize even though there is no FFT involved.
	// (Note that fftSize can only have particular values, not an
	// arbitrary integer.)
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
				peaks [k] = Math.max(peaks[k], powers[k]);
			}
		}

		channels.forEach((channel, i) => {
			channel[0].value = calculatePeaks(peaks[i]);
			channel[1].value = calculatePeaks(sumOfSquares[i] / buffers[0].length);
		});

		!shouldFuckOff && requestAnimationFrame(draw);
	}
	draw();
});

const computedWidth = (value: number): number => {
	const width = (1 + value / RANGE) * 90;
	// this fixes the animation jump from 0 to the first value
	return Math.max(0.01, width);
};

onUnmounted(() => shouldFuckOff = true);
</script>

<template>
  <div class="relative bg-meter-instantaneous min-w-40 transform -translate-y-1.75">
		<div v-for="i of metadata?.format.numberOfChannels" :key="i" class="text-xs absolute h-1.5 w-full" :style="`top: ${8 * i - 8}px;`">
		<!-- {{channel[1].value}} -->
		  <div class="bg absolute  top-0 bg-meter-background h-1.5 w-full" />
			<div class="clipping absolute  top-0 right-0 bg-meter-background-clipping h-1.5 w-10/100" />

			<div :class="channels[i - 1][0].value > 0 ? 'bg-meter-instantaneous-clipping' : 'bg-meter-instantaneous'" class="transition-all duration-100 absolute top-0  h-1.5" :style="`width: ${computedWidth(channels[i - 1][0].value)}%`" />
			<div :class="channels[i - 1][1].value > 0 ? 'bg-meter-average-clipping' : 'bg-meter-average'" class="absolute top-0  h-1.5" :style="`width: ${computedWidth(channels[i - 1][1].value)}%`" />
		</div>
  </div>
</template>

