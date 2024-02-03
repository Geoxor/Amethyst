<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import SubtitleText from "@/components/v2/SubtitleText.vue";
import TitleText from "@/components/v2/TitleText.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { MonitorIcon, StarsIcon } from "@/icons";
import { smoothTween } from "@/logic/dom";
import { bytesToHuman } from "@shared/formating";
import { useFps } from "@vueuse/core";
import { onMounted, ref } from "vue";

const state = useState();
const handleToggleVsync = () => {
  window.electron.ipcRenderer.invoke("set-vsync", [state.settings.value.useVsync]);
};

const minFps = ref(Number.POSITIVE_INFINITY);
const maxFps = ref(Number.NEGATIVE_INFINITY);
const currentFps = ref(-1);
const audioLatency = ref(-1);
const tweenedFps = ref(-1);
const appMetrics = ref<Electron.ProcessMetric[]>([]);

onMounted(() => {
  const fpsCounter = useFps({every: 30});
  setInterval(() => {
    currentFps.value = fpsCounter.value;
    if (currentFps.value > maxFps.value) maxFps.value = currentFps.value;
    if (currentFps.value < minFps.value) minFps.value = currentFps.value;
    amethyst.player.getLatency().then(l => audioLatency.value = l);
    smoothTween(tweenedFps.value, fpsCounter.value, 1000, (tweenedNumber => tweenedFps.value = ~~tweenedNumber));
    window.electron.ipcRenderer.invoke<Electron.ProcessMetric[]>("get-app-metrics").then(data => {
      appMetrics.value = data;
    });
  }, 1000);
});

</script>

<template>
  <div class="w-full flex gap-2">
    <div class="p-4 w-min rounded-8px bg-[#141621] text-text_title flex gap-4 items-center justify-between">
      <div class="flex-col flex justify-center h-full gap-2">
        <subtitle-text
          text="Minimum Framerate"
          class="text-12px"
        />
        <title-text :text="`${Number.isFinite(minFps) && minFps != -1 ? `${minFps} fps` : 'loading'}`" />
      </div>
      <div class="flex-col flex justify-center h-full gap-2">
        <subtitle-text
          text="Current Framerate"
          class="text-12px"
        />
        <title-text :text="`${Number.isFinite(tweenedFps) && tweenedFps != -1 ? `${tweenedFps} fps` : 'loading'}`" />
      </div>
      <div class="flex-col flex justify-center h-full gap-2">
        <subtitle-text
          text="Maximum Framerate"
          class="text-12px"
        />
        <title-text :text="`${Number.isFinite(maxFps) && maxFps != -1 ? `${maxFps} fps` : 'loading'}`" />
      </div>
    </div>

    <div class="p-4 w-full rounded-8px bg-[#141621] text-text_title flex gap-4 items-center justify-between">
      <div
        v-for="metric of appMetrics"
        :key="metric.pid"
        class="flex flex-col gap-2 w-full"
      >
        <div class="flex justify-between gap-2">
          <subtitle-text
            :text="metric.name || metric.serviceName || metric.type"
            class="text-12px"
          />
          <!-- These are in KB so we multiplty by 1024 to turn them into bytes for our function to parse properly -->
          <!-- https://www.electronjs.org/docs/latest/api/structures/memory-info -->
          <subtitle-text
            :text="bytesToHuman(metric.memory.workingSetSize * 1024)"
            class="text-12px"
          />
        </div>
        <processor-usage-meter :value="metric.cpu.percentCPUUsage" />
      </div>
    </div>

    <div class="p-4 w-min rounded-8px bg-[#141621] text-text_title flex flex-col gap-4">
      <div class="flex-col flex justify-center h-full gap-2">
        <subtitle-text
          text="Audio Latency"
          class="text-12px"
        />
        <title-text :text="`${Number.isFinite(audioLatency) && audioLatency != -1 ? `${audioLatency} ms` : 'loading'}`" />
      </div>
    </div>
  </div>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="MonitorIcon"
    :description="$t('settings.vsync.description')"
    :title="$t('settings.vsync.title')"
    :warning="$t('settings.vsync.warning')"
    :platforms="['desktop']"
  >
    <toggle-switch
      v-model="state.settings.value.useVsync" 
      @change="handleToggleVsync"
    />
  </settings-setting>

  <settings-setting
    :icon="StarsIcon"
    :description="$t('settings.pause_visuals.description')"
    :title="$t('settings.pause_visuals.title')"
  >
    <toggle-switch
      v-model="state.settings.value.pauseVisualsWhenUnfocused" 
    />
  </settings-setting>
</template>