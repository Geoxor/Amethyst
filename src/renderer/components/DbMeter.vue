<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();

const leftChannel = ref(-60);
const rightChannel = ref(-60);
const leftChannelAverage = ref(-60);
const rightChannelAverage = ref(-60);

const RANGE = 30;

let shouldFuckOff = false;

onMounted(() => {
	const context = props.node.context;

	const splitter = context.createChannelSplitter();
	const leftAnalyser = context.createAnalyser();
	const rightAnalyser = context.createAnalyser();
	leftAnalyser.fftSize = 2048 * 2;
	rightAnalyser.fftSize = 2048 * 2;

	props.node.connect(splitter);
	splitter.connect(leftAnalyser, 0, 0);
	splitter.connect(rightAnalyser, 1, 0);

	// Time domain samples are always provided with the count of
	// fftSize even though there is no FFT involved.
	// (Note that fftSize can only have particular values, not an
	// arbitrary integer.)
	const leftSampleBuffer = new Float32Array(leftAnalyser.fftSize);
	const rightSampleBuffer = new Float32Array(rightAnalyser.fftSize);
	const CHANNELS = 2;

	function draw() {
		leftAnalyser.getFloatTimeDomainData(leftSampleBuffer);
		rightAnalyser.getFloatTimeDomainData(rightSampleBuffer);

		// Compute peak instantaneous power over the interval.
		let peakLeft = 0;
		let peakRight = 0;
		let sumOfSquaresLeft = 0;
		let sumOfSquaresRight = 0;
		for (let i = 0; i < leftSampleBuffer.length; i += CHANNELS) {
			// Insta
			const powerLeft = leftSampleBuffer[i] ** 2;
			const powerRight = rightSampleBuffer[i] ** 2;

			// Average
			sumOfSquaresLeft += powerLeft;
			sumOfSquaresRight += powerRight;

			peakLeft = Math.max(peakLeft, powerLeft);
			peakRight = Math.max(peakRight, powerRight);
		}

		leftChannel.value = 10 * Math.log10(peakLeft);
		rightChannel.value = 10 * Math.log10(peakRight);
		leftChannelAverage.value = 10 * Math.log10(sumOfSquaresLeft / (leftSampleBuffer.length / CHANNELS));
		rightChannelAverage.value = 10 * Math.log10(sumOfSquaresRight / (rightSampleBuffer.length / CHANNELS));

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
    <div id="left-bg" class="absolute top-0 bg-meter-background h-1.5 w-full" />
    <div id="right-bg" class="absolute top-2 bg-meter-background h-1.5 w-full" />
    <div id="left-clipping" class="absolute top-0 right-0 bg-meter-background-clipping h-1.5 w-10/100" />
    <div id="right-clipping" class="absolute top-2 right-0  bg-meter-background-clipping h-1.5 w-10/100" />

    <div id="left-inst" :class="leftChannel > 0 ? 'bg-meter-instantaneous-clipping' : 'bg-meter-instantaneous'" class="transition-all duration-100 absolute top-0  h-1.5" :style="`width: ${computedWidth(leftChannel)}%`" />
    <div id="left-avg" :class="leftChannel > 0 ? 'bg-meter-average-clipping' : 'bg-meter-average'" class="absolute top-0  h-1.5" :style="`width: ${computedWidth(leftChannelAverage)}%`" />
    <div id="right-inst" :class="rightChannel > 0 ? 'bg-meter-instantaneous-clipping' : 'bg-meter-instantaneous'" class="transition-all duration-100 absolute top-2  h-1.5" :style="`width: ${computedWidth(rightChannel)}%`" />
    <div id="right-avg" :class="leftChannel > 0 ? 'bg-meter-average-clipping' : 'bg-meter-average'" class="absolute top-2  h-1.5" :style="`width: ${computedWidth(rightChannelAverage)}%`" />
  </div>
</template>

