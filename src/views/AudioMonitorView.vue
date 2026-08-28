<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import OutputDiagram from "@/components/OutputDiagram/OutputDiagram.vue";
import DecibelMeter from "@/components/v2/DecibelMeter.vue";
import OutputBreakdown from "@/components/v2/OutputBreakdown.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
</script>

<template>
  <div
    class="h-full w-full py-2 px-4 pb-32 text-text-title"
    :class="[amethyst.getCurrentPlatform() == 'mobile' ? 'px-2 pb-48' : 'px-4']"
  >
    <route-header :title="$t('route.audio_monitor')" />
    <div
      class="flex gap-2 h-full"
      :class="[amethyst.getCurrentPlatform() == 'mobile' && 'flex-col']"
    >
      <div class="sm:w-min">
        <decibel-meter
          :key="amethyst.player.nodeManager.getNodeConnectionsString()"
          :node="amethyst.player.nodeManager.master.post"
          :class="[amethyst.getCurrentPlatform() == 'mobile' ? 'h-48' : 'h-full']"
        />
      </div>
      <div class="flex gap-2 py-2 flex-col w-full">
        <output-breakdown />
        <output-diagram />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
