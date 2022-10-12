<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useState } from "../amethyst";
import { onMounted, onUnmounted, watch } from "vue";
import { getThemeColorHex } from "../logic/color";
import { transformLogarithmic } from "../logic/math";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();
const state = useState();

const SPECTRUM_HEIGHT = 76;

const SPECTRUM_WIDTH = SPECTRUM_HEIGHT * 2;
// const DOWNSCALE_FACTOR = 7;
const TILT_MULTIPLIER = 0.005; // 3dB/octave

// const DOWNSCALED_WIDTH =  SPECTRUM_WIDTH / DOWNSCALE_FACTOR;
// const DOWNSCALED_HEIGHT = SPECTRUM_HEIGHT / DOWNSCALE_FACTOR;
let shouldStopRendering = false;


onMounted(() => {
	const context = props.node.context;
	const gain = context.createGain();
	const analyser = context.createAnalyser();
	analyser.fftSize = state.settings.spectrumFftSize;
	analyser.smoothingTimeConstant = state.settings.spectrumSmoothing;

	// Don't change these
	analyser.maxDecibels = 30;
	analyser.minDecibels = -120;

	// Updates the FFT size whenever it changes in the settings in real time
	watch(() => state.settings.spectrumFftSize, () => analyser.fftSize = state.settings.spectrumFftSize)
	watch(() => state.settings.spectrumSmoothing, () => analyser.smoothingTimeConstant = state.settings.spectrumSmoothing)

	props.node.connect(gain);
	// Raising the gain into the analyzer to compensate for the tilt bottom end loss
	gain.connect(analyser);

	const spectrum = document.querySelector("#spectrum") as HTMLCanvasElement;
	const canvasCtx = computed(() => {
		const canvas = spectrum.getContext("2d")!;
		return canvas;
	});

	function draw() {
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		canvasCtx.value.clearRect(0, 0, screen.width, screen.height);
		analyser.getByteFrequencyData(dataArray);

		const points = state.settings.useLogarithmicSpectrum ? transformLogarithmic(dataArray) : dataArray;
		const barWidth = SPECTRUM_WIDTH / points.length;
		const tiltOffset = TILT_MULTIPLIER * points.length;

		const primaryColor = getThemeColorHex("--primary-900");
		canvasCtx.value!.fillStyle = primaryColor;

		for (let i = 0; i < points.length; i++) {
			const tilt = (i * TILT_MULTIPLIER) - tiltOffset;
			const y = points[i] * state.settings.spectrumVerticalZoom;
			const barHeight = ((y + tilt) / 255 * SPECTRUM_HEIGHT);
			canvasCtx.value!.fillRect(i * barWidth, SPECTRUM_HEIGHT - barHeight, 1, barHeight);
		}

		// // TODO: make this into a toggleable option in the settings
		// // Downscale the canvas to pixelize so it fits with the aesthetic of the app 
		// canvasCtx.value.drawImage(spectrum, 0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT);
		// canvasCtx.value.clearRect(0, DOWNSCALED_HEIGHT, SPECTRUM_WIDTH, SPECTRUM_HEIGHT - (DOWNSCALED_HEIGHT))
		// canvasCtx.value.clearRect(DOWNSCALED_WIDTH, 0, SPECTRUM_WIDTH, DOWNSCALED_HEIGHT);
		// canvasCtx.value.drawImage(spectrum, 0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT, 0, 0, SPECTRUM_WIDTH, SPECTRUM_HEIGHT);
		// // this line clears the downscaled image thats drawn at the 
		// // top left of the canvas by drawing a white rectangle over it
		// // its kinda trollface but it works i guess
		// // TODO: refactor this later because some low freq values get clipped under it
		// canvasCtx.value.clearRect(0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT); 


		!shouldStopRendering && requestAnimationFrame(draw);
	}

	draw();
});

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
	<div :style="`min-width: ${SPECTRUM_WIDTH}px;`" class="flex flex-col bg-surface-900 rounded-4px overflow-hidden">
		<canvas id="spectrum" ref="spectrum" :width="SPECTRUM_WIDTH" :height="SPECTRUM_HEIGHT" />
	</div>
</template>

