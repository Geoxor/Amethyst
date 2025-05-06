<script setup lang="ts">
import { amethyst } from "@/amethyst";
import OutputDiagram from "@/components/OutputDiagram/OutputDiagram.vue";
import DecibelMeter from "@/components/v2/DecibelMeter.vue";
import OutputBreakdown from "@/components/v2/OutputBreakdown.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
</script>

<template>
  <div
    v-if="amethyst.player.source" 
    class="flex flex-col h-full w-full py-2 px-4 gap-4 pb-24 text-text_title"
  >
    <route-header :title="$t('route.audio_monitor')" />
    <div class="flex gap-2 h-full">
      <decibel-meter
        :key="amethyst.player.nodeManager.getNodeConnectionsString()"
        :node="amethyst.player.nodeManager.master.post"
      />
      <div class="flex gap-2 flex-col w-full">
        <output-breakdown />
        <output-diagram />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>