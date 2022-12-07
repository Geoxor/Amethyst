<script setup lang="ts">
import MenuOption from "@/components/menu/MenuOption.vue";
import { IContextMenuOption } from "@/state";
import { onClickOutside } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { useContextMenu } from ".";
const menu = ref<HTMLElement>();
const contextMenu = useContextMenu();
onClickOutside(menu, () => contextMenu.state.isVisible = false);
onMounted(() => updatePositon());
watch(() => contextMenu.state.position.x, () => updatePositon());

const runAction = (option: IContextMenuOption) => {
  option.action();
  contextMenu.state.isVisible = false;
};

const updatePositon = () => {
  menu.value && Object.assign(menu.value.style, {
    left: `${contextMenu.state.position.x}px`,
    top: `${contextMenu.state.position.y}px`,
  });
};

</script>

<template>
  <div
    id="contextMenu"
    ref="menu"
    role="contextMenu"
    class="absolute text-primary-900 py-1 shadow-xl border-1 border-surface-600 bg-surface-800 z-100"
  >
    <ul class="flex flex-col min-w-48">
      <menu-option
        v-for="option of contextMenu.state.options"
        :key="option.title"
        :icon="option.icon"
        :title="option.title"
        :red="option.red"
        :shortcuts="option.shortcuts"
        @click="runAction(option)"
      />
    </ul>
  </div>
</template>