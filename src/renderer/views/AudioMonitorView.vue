<script setup lang="ts">
import { amethyst } from "@/amethyst";
import DecibelMeter from "@/components/v2/DecibelMeter.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
</script>

<template>
  <div
    v-if="amethyst.player.source" 
    class="flex flex-col h-full w-full py-2 px-4 gap-4"
  >
    <route-header :title="$t('route.audio_monitor')" />
    <decibel-meter
      :key="amethyst.player.nodeManager.getNodeConnectinsString()"
      :node="amethyst.player.nodeManager.master.post"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>