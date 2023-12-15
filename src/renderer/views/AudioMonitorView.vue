<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import DecibelMeter from "@/components/v2/DecibelMeter.vue";
import RouteHeader from "@/components/v2/RouteHeader.vue";
const state = useState();
</script>

<template>
  <div
    v-if="amethyst.player.source" 
    class="flex flex-col h-full w-full gap-2 p-2"
  >
    <RouteHeader title="Audio Monitor" />
    <DecibelMeter
      :key="amethyst.player.nodeManager.getNodeConnectinsString()"
      :node="amethyst.player.nodeManager.master.post"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>