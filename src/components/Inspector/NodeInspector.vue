<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { amethyst } from "@/amethyst.js";
import { AmethystAudioNode } from "@/logic/audio";
const props = defineProps<{ node: AmethystAudioNode }>();
import DbMeter from "@/components/visualizers/DbMeter.vue";
import { AmethystOutputNode } from "@/nodes";
import DraggableModifierInput from "../input/DraggableModifierInput.vue";
import QuickMenu from "../nodes/QuickMenu.vue";
import DropdownInput from "../v2/DropdownInput.vue";

</script>

<template>
  <div class="pb-42 h-full overflow-y-auto">
    <section controls>
      <h1>
        <icon
          icon="ic:twotone-settings"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        {{ $t('node.controls') }}
      </h1>
      <quick-menu
        :node="node"
      />
    </section>
    <section audio>
      <h1>
        <icon
          icon="ic:twotone-input"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        {{ $t('node.in_out') }}
      </h1>
      <span class="flex gap-2 h-32 justify-between items-center">
        <db-meter
          :key="node.properties.id"
          pre
          :node="node.pre"
          :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
        />
        <icon
          :icon="node.properties.icon"
          class="h-12 w-12"
        />
        <db-meter
          v-if="!(node instanceof AmethystOutputNode)"
          :key="node.properties.id"
          post
          :node="node.post"
          :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
        />
        <span v-else />
      </span>
    </section>

    <section
      v-if="Object.values(node.getParameters()).length != 0"
      parameters
    >
      <h1>
        <icon
          icon="solar:volume-knob-broken"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        {{ $t('node.parameters') }}
      </h1>

      <div
        v-for="(value, key) in node.getParameters()"
        :key="key"
        class="flex gap-2 items-center my-2 justify-between"
      >
        <h1>{{ key }}</h1>
        <draggable-modifier-input
          v-if="value.type == 'number'"
          v-model="node[key]"
          :step="value.step"
          :max="value.max"
          :min="value.min"
          :suffix="value.unit"
          :default="value.default"
        />

        <dropdown-input
          v-else-if="value.type == 'string'"
          v-model="node[key]"
          :options="value.options"
        />
      </div>
    </section>

    <section properties>
      <h1>
        <icon
          icon="ic:twotone-crop-16-9"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        {{ $t('node.properties') }}
      </h1>
      {{ node.properties.name }}
      <h2 class="text-text-subtitle">
        {{ node.properties.id }}
      </h2>
    </section>
  </div>
</template>
