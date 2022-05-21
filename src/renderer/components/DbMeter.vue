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
	const gain1 = context.createGain();
	const analyser = context.createAnalyser();

	// Reduce output level to not hurt your ears.
	const gain2 = context.createGain();
	gain2.gain.value = 0.01;

	props.node.connect(gain1);
	gain1.connect(analyser);
	analyser.connect(gain2);
	gain2.connect(context.destination);

	// Time domain samples are always provided with the count of
	// fftSize even though there is no FFT involved.
	// (Note that fftSize can only have particular values, not an
	// arbitrary integer.)
	analyser.fftSize = 2048 * 2;
	const sampleBuffer = new Float32Array(analyser.fftSize);
	const CHANNELS = 2;

	function draw() {
		analyser.getFloatTimeDomainData(sampleBuffer);

		// Compute peak instantaneous power over the interval.
		let peakLeft = 0;
		let peakRight = 0;
		let sumOfSquaresLeft = 0;
		let sumOfSquaresRight = 0;
		for (let i = 0; i < sampleBuffer.length; i += CHANNELS) {
			// Insta
			const powerLeft = sampleBuffer[i] ** 2;
			const powerRight = sampleBuffer[i + 1] ** 2;

			// Average
			sumOfSquaresLeft += powerLeft;
			sumOfSquaresRight += powerRight;

			peakLeft = Math.max(peakLeft, powerLeft);
			peakRight = Math.max(peakRight, powerRight);
		}

		leftChannel.value = 10 * Math.log10(peakLeft);
		rightChannel.value = 10 * Math.log10(peakRight);
		leftChannelAverage.value = 10 * Math.log10(sumOfSquaresLeft / (sampleBuffer.length / CHANNELS));
		rightChannelAverage.value = 10 * Math.log10(sumOfSquaresRight / (sampleBuffer.length / CHANNELS));

		!shouldFuckOff && requestAnimationFrame(draw);
	}
	draw();
});

onUnmounted(() => shouldFuckOff = true);
</script>

<template>
  <div class="relative min-w-40 transform -translate-y-1.75">
    <div id="left-bg" class="absolute top-0 bg-gray-200 h-1.5 w-full" />
    <div id="right-bg" class="absolute top-2 bg-gray-200 h-1.5 w-full" />
    <div id="left-0db" class="absolute top-0 right-0 bg-gray-300 h-1.5 w-10/100" />
    <div id="right-0db" class="absolute top-2 right-0  bg-gray-300 h-1.5 w-10/100" />

    <div id="left-inst" :class="leftChannel > 0 ? 'bg-red-500' : 'bg-green-500'" class="transition-all duration-100 absolute top-0  h-1.5" :style="`width: ${(1 + leftChannel / RANGE) * 90}%`" />
    <div id="left-avg" :class="leftChannel > 0 ? 'bg-red-400' : 'bg-green-400'" class="absolute top-0  h-1.5" :style="`width: ${(1 + leftChannelAverage / RANGE) * 90}%`" />
    <div id="right-inst" :class="rightChannel > 0 ? 'bg-red-500' : 'bg-green-500'" class="transition-all duration-100 absolute top-2  h-1.5" :style="`width: ${(1 + rightChannel / RANGE) * 90}%`" />
    <div id="right-avg" :class="leftChannel > 0 ? 'bg-red-400' : 'bg-green-400'" class="absolute top-2  h-1.5" :style="`width: ${(1 + rightChannelAverage / RANGE) * 90}%`" />
  </div>
</template>

