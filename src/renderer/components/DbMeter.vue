<script setup lang="ts">
import { onMounted, ref } from "vue";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();

const leftChannel = ref(-60);
const rightChannel = ref(-60);
const leftChannelAverage = ref(-60);
const rightChannelAverage = ref(-60);

const RANGE = 30;

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

	function loop() {
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

		requestAnimationFrame(loop);
	}
	loop();
});
</script>

<template>
  <div>
    <button id="start">
      Start
    </button>

    <div class="p-6">
      <div class="relative h-32">
        <div id="left-bg" class="absolute bottom-0 left-0 bg-gray-200 w-1.5 h-full" />
        <div id="right-bg" class="absolute bottom-0 left-1.75 bg-gray-200 w-1.5 h-full" />
        <div id="left-0db" class="absolute top-0 left-0 bg-gray-300 w-1.5 h-10/100" />
        <div id="right-0db" class="absolute top-0 left-1.75 bg-gray-300 w-1.5 h-10/100" />

        <div id="left-inst" class="absolute bottom-0 left-0 bg-green-500 w-1.5" :style="`height: ${(1 + leftChannel / RANGE) * 90}%`" />
        <div id="left-avg" class="absolute bottom-0 left-0 bg-green-400 w-1.5" :style="`height: ${(1 + leftChannelAverage / RANGE) * 90}%`" />
        <div id="right-inst" class="absolute bottom-0 left-1.75 bg-green-500 w-1.5" :style="`height: ${(1 + rightChannel / RANGE) * 90}%`" />
        <div id="right-avg" class="absolute bottom-0 left-1.75 bg-green-400 w-1.5" :style="`height: ${(1 + rightChannelAverage / RANGE) * 90}%`" />
      </div>
    </div>

    <p />
  </div>
</template>

