<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { getThemeColorRgb } from "@/logic/color";
import {logParabolicSpectrum, normalize8bit} from "@/logic/math";
import * as THREE from "three";
import { watch } from "vue";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import {VISUALIZER_BIN_COUNT} from "@shared/constants";

const props = defineProps<{
  node: AudioNode,
  spectrogram?: boolean,
}>();

const context = props.node.context;
const analyser = context.createAnalyser();

props.node.connect(analyser);

const updateAnalyser = () => {
  analyser.fftSize = props.spectrogram
      ? amethyst.state.settings.value.spectrogram.fftSize
      : amethyst.state.settings.value.spectrumFftSize;
  analyser.smoothingTimeConstant = props.spectrogram
      ? amethyst.state.settings.value.spectrogram.smoothing
      : amethyst.state.settings.value.spectrumSmoothing;
};

updateAnalyser();

watch(() => [
    amethyst.state.settings.value.spectrumFftSize,
    amethyst.state.settings.value.spectrumSmoothing,
    amethyst.state.settings.value.spectrogram.fftSize,
    amethyst.state.settings.value.spectrogram.smoothing
], updateAnalyser);

// Don't change these
analyser.maxDecibels = -0;
analyser.minDecibels = -128;

// get color for the spectrum from the current theme
const [r, g, b] = getThemeColorRgb("--accent");
const spectrumColor = new THREE.Vector3(normalize8bit(r), normalize8bit(g), normalize8bit(b));

const uniformData = {
  u_color: {value: spectrumColor},
  u_amplitudes: {value: new Float32Array(VISUALIZER_BIN_COUNT)},
};

amethyst.state.on("theme:change", () => {
  const [r, g, b] = getThemeColorRgb("--accent");
  spectrumColor.set(normalize8bit(r), normalize8bit(g), normalize8bit(b));
  uniformData.u_color.value = spectrumColor;
});

const spectrumShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * float(u_amplitudes.length()))];
    float underCurve = 0.0;
    if(uv.y <= amplitude) {
      underCurve = 1.0;
    }
    gl_FragColor = vec4(u_color * underCurve, underCurve);
  }`;

const spectrogramShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform sampler2D u_backbuffer;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.y * float(u_amplitudes.length()))];
    amplitude = clamp(pow(amplitude, 2.0), 0.0, 1.0);

    // If first column
    if (gl_FragCoord.x == 0.5) {
      gl_FragColor = vec4(u_color - amplitude, 1.0);
    } else {
      // Get the color of the previous column (x-1)
      gl_FragColor = texture2D(u_backbuffer, vec2(uv.x - (1.0 / u_resolution.x), uv.y));
    }
  }`;

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);
};

const shouldPause = () => amethyst.state.settings.value.pauseVisualsWhenUnfocused && !amethyst.state.window.isFocused;

const getShader = () => props.spectrogram ? spectrogramShader : spectrumShader;

</script>

<template>
  <div class="relative overflow-hidden w-full h-full rounded-4px">
    <shader-canvas
      class="origin-top-left absolute"
      :frag-shader="getShader()"
      :analyser="analyser"
      :pause-rendering="shouldPause()"
      :uniforms="uniformData"
      @on-render="render"
    />
  </div>
</template>
