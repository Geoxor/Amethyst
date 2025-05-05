<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { onMounted, onUnmounted, watch } from "vue";
import {VISUALIZER_BIN_COUNT} from "@shared/constants";

const props = defineProps<{ node: AudioNode, width: number, height: number }>();
const randomId = Date.now();

let canvas: CanvasRenderingContext2D;
let shouldStopRendering = false;

onMounted(() => {
  const oscilloscope = document.querySelector(`#oscilloscope-${randomId}`) as HTMLCanvasElement;
  canvas = oscilloscope.getContext("2d")!;
  canvas.strokeStyle = `${getThemeColorHex("--accent")}99`;

  canvas.lineWidth = amethyst.state.settings.value.oscilloscope.lineThickness;
  
  watch(() => amethyst.state.settings.value.oscilloscope.lineThickness, () => {
    canvas.lineWidth = amethyst.state.settings.value.oscilloscope.lineThickness;
  });

  const { context } = props.node;
  const oscilloscopeAnalyzer = context.createAnalyser();

  oscilloscopeAnalyzer.smoothingTimeConstant = amethyst.state.settings.value.oscilloscope.smoothing;
  oscilloscopeAnalyzer.fftSize = amethyst.state.settings.value.oscilloscope.fftSize;

  let oscilloscopeBuffer = new Uint8Array(oscilloscopeAnalyzer.frequencyBinCount);
  let segmentWidth = props.width / oscilloscopeAnalyzer.frequencyBinCount;

  watch(() => amethyst.state.settings.value.oscilloscope.smoothing, () => {
    oscilloscopeAnalyzer.smoothingTimeConstant = amethyst.state.settings.value.oscilloscope.smoothing;
  });

  watch(() => amethyst.state.settings.value.oscilloscope.fftSize, () => {
    oscilloscopeAnalyzer.fftSize = amethyst.state.settings.value.oscilloscope.fftSize;
    oscilloscopeBuffer = new Uint8Array(oscilloscopeAnalyzer.frequencyBinCount);
    segmentWidth = props.width / oscilloscopeAnalyzer.frequencyBinCount;
  });

  props.node.connect(oscilloscopeAnalyzer);

  watch(() => amethyst.state.window.isFocused, isFocused => {
    if (amethyst.state.settings.value.pauseVisualsWhenUnfocused) {
      if (!isFocused) shouldStopRendering = true;
      else {
        shouldStopRendering = false;
        draw();
      }
    }
  });

  function draw() {

    oscilloscopeAnalyzer.getByteTimeDomainData(oscilloscopeBuffer);
    segmentWidth = props.width / oscilloscopeAnalyzer.frequencyBinCount;

    canvas.clearRect(0, 0, screen.width, screen.height);
    canvas.beginPath();

    for (let i = 1; i < oscilloscopeAnalyzer.frequencyBinCount; i += 1) {
      let x = i * segmentWidth;
      let v = oscilloscopeBuffer[i] / 128.0;
      let y = (v * props.height) / 2;
      canvas.lineTo(x, y);
    }

    canvas.stroke();

    !shouldStopRendering && requestAnimationFrame(draw);
  }

  draw();
});

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <canvas
    :id="`oscilloscope-${randomId}`"
    class="transform rounded-4px"
    :width="width"
    :height="height"
  />
</template>

<style scoped lang="postcss">

</style>