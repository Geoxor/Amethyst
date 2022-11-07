<script setup lang="ts">
import { useState } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { interpolateArray, scaleLog } from "@/logic/math";
import { computed, onMounted, onUnmounted, watch } from "vue";
const props = defineProps<{ node: AudioNode }>();
const state = useState();

const SPECTRUM_HEIGHT = 76;
const SPECTRUM_WIDTH = SPECTRUM_HEIGHT * 2;
const TILT_MULTIPLIER = 0.005; // 3dB/octave

let shouldStopRendering = false;
let randomId = Date.now();

onMounted(() => {
	const { context } = props.node;
	const gain = context.createGain();
	const analyser = context.createAnalyser();
	analyser.fftSize = state.settings.spectrumFftSize;
	analyser.smoothingTimeConstant = state.settings.spectrumSmoothing;

	// Don't change these
	analyser.maxDecibels = 30;
	analyser.minDecibels = -120;

	// Updates the FFT size whenever it changes in the settings in real time
	watch(() => state.settings.spectrumFftSize, () => analyser.fftSize = state.settings.spectrumFftSize);
	watch(() => state.settings.spectrumSmoothing, () => analyser.smoothingTimeConstant = state.settings.spectrumSmoothing);

	props.node.connect(gain);

	// Raising the gain into the analyzer to compensate for the tilt bottom end loss
	gain.connect(analyser);

	const spectrum = document.querySelector(`#spectrum-${randomId}`) as HTMLCanvasElement;
	const canvasCtx = computed(() => {
		const canvas = spectrum.getContext("2d")!;
		return canvas;
	});

	function draw() {
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		canvasCtx.value.clearRect(0, 0, screen.width, screen.height);
		analyser.getByteFrequencyData(dataArray);

		const points = state.settings.useLogarithmicSpectrum ? scaleLog(dataArray) : dataArray;
		const tiltOffset = TILT_MULTIPLIER * points.length;

		const primaryColor = getThemeColorHex("--primary-800");
		canvasCtx.value.fillStyle = `${primaryColor}16`;
		canvasCtx.value.strokeStyle = primaryColor;

		const heightPoints = [];

		for (let i = 0; i < points.length; i++) {
			const tilt = (i * TILT_MULTIPLIER) - tiltOffset;
			const barHeight = ((points[i] * state.settings.spectrumVerticalZoom + tilt) / 255 * SPECTRUM_HEIGHT);
			const y = SPECTRUM_HEIGHT - barHeight;
			heightPoints.push(y);
		}

		const interpolated = interpolateArray(heightPoints, SPECTRUM_WIDTH);
		canvasCtx.value.moveTo(0, 0);
		canvasCtx.value.beginPath();

		for (let i = 0; i < interpolated.length; i++) {
			const y = interpolated[i];
			canvasCtx.value.fillRect(i, y, 1, SPECTRUM_HEIGHT - y);
			canvasCtx.value.lineTo(i, y + 1);
			canvasCtx.value.stroke();

		}

		!shouldStopRendering && requestAnimationFrame(draw);
	}

	draw();
});

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <div
    :style="`min-width: ${SPECTRUM_WIDTH}px;`"
    class="flex flex-col bg-surface-900 rounded-4px overflow-hidden"
  >
    <canvas
      :id="`spectrum-${randomId}`"
      :width="SPECTRUM_WIDTH"
      :height="SPECTRUM_HEIGHT"
    />
  </div>
</template>
