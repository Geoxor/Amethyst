<script setup lang="ts">
import { useState } from "@/amethyst";
import MenuOption from "@/components/menu/MenuOption.vue";
import { IContextMenuOption } from "@/state";
import { onClickOutside } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
const state = useState();
const contextMenu = ref<HTMLElement>();
onClickOutside(contextMenu, () => state.state.contextMenu.isVisible = false);
onMounted(() => updatePositon());
watch(() => state.state.contextMenu.position.x, () => updatePositon());

const runAction = (option: IContextMenuOption) => {
  option.action();
  state.state.contextMenu.isVisible = false;
};

const updatePositon = () => {
  contextMenu.value && Object.assign(contextMenu.value.style, {
    left: `${state.state.contextMenu.position.x}px`,
    top: `${state.state.contextMenu.position.y}px`,
  });
};

</script>

<template>
  <div
    id="contextMenu"
    ref="contextMenu"
    role="contextMenu"
    class="absolute text-primary-900 py-1 shadow-xl border-1 border-surface-600 bg-surface-800 z-100"
  >
    <ul class="flex flex-col min-w-48">
      <menu-option
        v-for="option of state.state.contextMenu.options"
        :key="option.title"
        :icon="option.icon"
        :title="option.title"
        @click="runAction(option)"
      />
    </ul>
  </div>
</template>