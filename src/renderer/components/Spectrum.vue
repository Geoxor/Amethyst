<script setup lang="ts">
import { computed, ComputedRef } from "@vue/reactivity";
import { onMounted, onUnmounted } from "vue";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();
const SPECTRUM_WIDTH = 500;
const SPECTRUM_HEIGHT = 150;
const DOWNSCALE_FACTOR = 7;
const TILT_MULTIPLIER = 0.005; // 3dB/octave
const FFT_SIZE = 8192;
const VERTICAL_ZOOM_FACTOR = 1.5;
const DOWNSCALED_WIDTH =  SPECTRUM_WIDTH / DOWNSCALE_FACTOR;
const DOWNSCALED_HEIGHT = SPECTRUM_HEIGHT / DOWNSCALE_FACTOR;
const defaultSpectrumColor = "#868aff";

let shouldFuckOff = false;

const getLogIndex = (value: number, min: number, max: number) => {
	const exp = value / min / (max - min);
	return min * (max / min) ** exp;
};

const transformLogarithmic = (array: Uint8Array): Uint8Array => {
	const logArray = [];

	for (let i = 1; i < array.length; i++) {
		const idx = getLogIndex(i, 1, array.length - 1);
		const low = ~~idx;
		const high = Math.ceil(idx);
		const lv = array[low];
		const hv = array[high];
		const w = (idx - low) / (high - low);
		const v = lv + (hv - lv) * w;
		logArray.push(v);
	}

	return new Uint8Array(logArray);
};

onMounted(() => {
	const context = props.node.context;
	const gain = context.createGain();
	const analyser = context.createAnalyser();
	analyser.fftSize = FFT_SIZE;
	analyser.smoothingTimeConstant = 0.5;
	analyser.maxDecibels = 30;
	analyser.minDecibels = -120;

	props.node.connect(gain);
	// Raising the gain into the analyzer to compensate for the tilt bottom end loss
	gain.connect(analyser);

	const spectrum = document.querySelector("#spectrum") as HTMLCanvasElement;
	const canvasCtx = <ComputedRef<CanvasRenderingContext2D>>computed(() => {
		const canvas = spectrum.getContext("2d");

		if (canvas) {
			const gradient = canvas.createLinearGradient(0, SPECTRUM_HEIGHT, 0, 0);
			const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || defaultSpectrumColor;
			const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-secondary") || defaultSpectrumColor;
			gradient.addColorStop(0, primaryColor);
			gradient.addColorStop(1, secondaryColor);
			canvas.fillStyle = gradient;
			canvas.imageSmoothingEnabled = false;
			return canvas;
		}
		return canvas;
	});

	function draw() {
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
 
		canvasCtx.value?.clearRect(0, 0, screen.width, screen.height);
		analyser.getByteFrequencyData(dataArray);

		const logArray = transformLogarithmic(dataArray);
		const barWidth = SPECTRUM_WIDTH / logArray.length;
		const tiltOffset = TILT_MULTIPLIER * logArray.length;

		for (let i = 0; i < logArray.length; i++) {
			const tilt = (i * TILT_MULTIPLIER) - tiltOffset;
			const x = logArray[i] * VERTICAL_ZOOM_FACTOR;
			const barHeight = ((x + tilt) / 255 * SPECTRUM_HEIGHT);
			canvasCtx.value.fillRect(i * barWidth, SPECTRUM_HEIGHT - barHeight, 1, barHeight);
		}

		// TODO: make this into a toggleable option in the settings
		// Downscale the canvas to pixelize so it fits with the aesthetic of the app 
		canvasCtx.value.drawImage(spectrum, 0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT);
		canvasCtx.value.clearRect(0, DOWNSCALED_HEIGHT, SPECTRUM_WIDTH, SPECTRUM_HEIGHT - (DOWNSCALED_HEIGHT))
		canvasCtx.value.clearRect(DOWNSCALED_WIDTH, 0, SPECTRUM_WIDTH, DOWNSCALED_HEIGHT);
		canvasCtx.value.drawImage(spectrum, 0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT, 0, 0, SPECTRUM_WIDTH, SPECTRUM_HEIGHT);
		// this line clears the downscaled image thats drawn at the 
		// top left of the canvas by drawing a white rectangle over it
		// its kinda trollface but it works i guess
		// TODO: refactor this later because some low freq values get clipped under it
		canvasCtx.value.clearRect(0, 0, DOWNSCALED_WIDTH, DOWNSCALED_HEIGHT); 


		!shouldFuckOff && requestAnimationFrame(draw);
	}

	draw();
});

onUnmounted(() => shouldFuckOff = true);
</script>

<template>
  <div class="w-min flex bg-spectrum-background flex-col">
    <canvas
      id="spectrum"
      ref="spectrum"
      :width="SPECTRUM_WIDTH"
      :height="SPECTRUM_HEIGHT"
    />
  </div>
</template>

