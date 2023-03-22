<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import NavigationButton from "@/components/NavigationButton.vue";
import { PaintBrushIcon, GeometryIcon, CircusRingOfFireIcon, PuzzleIcon, WaveIcon } from "@/icons/material";
</script>

<template>
  <div class="h-full flex w-full">
    <navigation-bar class="w-56">
      <navigation-button
        :icon="PaintBrushIcon"
        :active="$route.name == 'settings.appearance'"
        text="Appearance"
        description="background, themes, visability"
        @click="$router.push({ name: 'settings.appearance' })"
      />
      <navigation-button
        :icon="CircusRingOfFireIcon"
        :active="$route.name == 'settings.performance'"
        text="Performance"
        description="vsync, animations, rendering"
        @click="$router.push({ name: 'settings.performance' })"
      />
      <navigation-button
        :icon="WaveIcon"
        :active="$route.name == 'settings.metering'"
        text="Metering"
        description="spectrums, vectorscopes, meters"
        @click="$router.push({ name: 'settings.metering' })"
      />
      <navigation-button
        :icon="GeometryIcon"
        :active="$route.name == 'settings.behaviour'"
        text="Behaviour"
        description="concurrency, startup, defaults"
        @click="$router.push({ name: 'settings.behaviour' })"
      />
      
      <navigation-button
        :icon="PuzzleIcon"
        :active="$route.name == 'settings.integration'"
        text="Integrations"
        description="discord, app integrations, etc"
        @click="$router.push({ name: 'settings.integration' })"
      />
    </navigation-bar>
    <div class="p-4 text-11px w-full h-full flex flex-col gap-2 overflow-y-auto">
      <router-view />
    </div>
  </div>
  <!-- <div class="p-2 text-primary-900 text-12px whitespace-nowrap">

    <div class="overflow-hidden overflow-y-auto h-full ">
      <h1 class="text-xl">
        Settings
      </h1>

      <div class="pr-2 flex flex-col gap-3 relative">
        <settings-group text="Ambient Background" />
        <settings-binary-switch
          v-model="state.settings.showAmbientBackground"
          text="Enabled"
        />
        <settings-binary-switch
          v-model="state.settings.ambientBackgroundSpin"
          text="Spin"
        />
        <settings-modifier
          v-model="state.settings.ambientBackgroundSpinSpeed"
          text="Spin speed"
          :min="1"
          :max="64"
          :step="0.01"
          :def="state.defaultSettings.ambientBackgroundSpinSpeed"
        />
        <settings-modifier
          v-model="state.settings.ambientBackgroundOpacity"
          text="Opacity"
          :min="0"
          :max="100"
          :step="1"
          :def="state.defaultSettings.ambientBackgroundOpacity"
        />

        <settings-modifier
          v-model="state.settings.ambientBackgroundZoom"
          text="Zoom"
          :min="0"
          :max="500"
          :step="1"
          :def="state.defaultSettings.ambientBackgroundZoom"
        />
        <settings-modifier
          v-model="state.settings.ambientBackgroundBlurStrength"
          text="Blur strength"
          :min="0"
          :max="256"
          :step="1"
          :def="state.defaultSettings.ambientBackgroundBlurStrength"
        />

        <settings-group text="Covers" />
        <settings-binary-switch
          v-model="state.settings.showCoverArt"
          text="Show cover art"
        />

        <settings-group text="Queue List" />
        <settings-modifier
          v-model="state.settings.processingConcurrency"
          text="Processing concurrency"
          :min="1"
          :max="32"
          :step="1"
          :def="state.defaultSettings.processingConcurrency"
        />

        <settings-group text="Playback Controls" />
        <settings-binary-switch
          v-model="state.settings.showPlaybackControls"
          text="Show"
        />

        <settings-group text="Vectorscope" />
        <settings-binary-switch
          v-model="state.settings.showVectorscope"
          text="Enabled"
        />
        <settings-binary-switch
          v-model="state.settings.diagonalVectorscope"
          text="Diagonal"
        />

        <settings-modifier
          v-model="state.settings.vectorscopeLineThickness"
          text="Line thickness"
          :min="0.1"
          :max="5"
          :step="0.50"
          :def="state.defaultSettings.vectorscopeLineThickness"
        />

        <settings-group text="Spectrum" />
        <settings-binary-switch
          v-model="state.settings.showSpectrum"
          text="Show spectrum"
        />
        <settings-binary-switch
          v-model="state.settings.useLogarithmicSpectrum"
          text="Logarithmic spectrum"
        />
        <settings-modifier
          v-model="state.settings.spectrumVerticalZoom"
          text="Vertical zoom"
          :min="0.5"
          :max="2"
          :step="0.1"
          :def="state.defaultSettings.spectrumVerticalZoom"
        />
        <settings-modifier
          v-model="state.settings.spectrumSmoothing"
          text="Smoothing"
          :min="0.01"
          :max="0.99"
          :step="0.1"
          :def="state.defaultSettings.spectrumSmoothing"
        />
        <settings-modifier
          v-model="state.settings.spectrumFftSize"
          text="FFT size"
          :range="[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]"
          :def="state.defaultSettings.spectrumFftSize"
        />

        <settings-group text="decibel meter" />
        <settings-binary-switch
          v-model="state.settings.showDbMeter"
          text="Enabled"
        />

        <settings-group text="Integrations" />
        <settings-binary-switch
          v-model="state.settings.useDiscordRichPresence"
          text="Discord Rich Presence"
        />

        <div class="flex-col flex gap-2">
          <splitter />
          <div class="flex w-full text-primary-1000 text-opacity-25 justify-between items-center">
            Made by: <geoxor-logo 
              class="h-2 w-min"
            />
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>
