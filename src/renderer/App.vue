<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import MenuBar from "@/components//menu/MenuBar.vue";

import ContextMenu from "@/components/input/ContextMenu.vue";
import Queue from "@/components/QueueList.vue";
import SettingsBar from "@/components/SettingsBar.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import Spectrum from "@/components/visualizers/SpectrumAnalyzer.vue";

import EmptyDiv from "@/components/EmptyDiv.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import NodeEditor from "@/components/NodeEditor.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";

const state = useState();
const player = usePlayer();
</script>

<template>
  <div class="flex fixed flex-col">
    <menu-bar />
    <context-menu v-if="state.state.contextMenu.isVisible" />
    <div class="h-full whitespace-nowrap flex flex-col justify-between overflow-hidden">
      <div class="flex-1 flex h-full max-h-full overflow-hidden">
        <navigation-bar />
        <queue v-if="state.settings.showQueue" />
        <node-editor v-if="state.settings.showNodeEditor" />
        <empty-div
          v-else
          class="bg-black bg-opacity-25 w-full borderRight"
        />
        <settings-bar v-if="state.settings.showSettings" />
      </div>

      <div class="flex gap-2 p-2 bg-surface-800 borderTop">
        <vectorscope
          v-if="state.settings.showVectorscope && player.state.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
        />

        <spectrum
          v-if="state.settings.showSpectrum && player.state.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
        />

        <db-meter
          v-if="state.settings.showDbMeter && player.state.source"
          :key="player.nodeManager.getNodeConnectinsString()"
          :node="player.nodeManager.master.node"
        />

        <playback-buttons :player="player" />
      </div>
    </div>
  </div>
</template> 
