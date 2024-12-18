<script setup lang="ts">
import MenuOption from "@/components/menu/MenuOption.vue";
import { IContextMenuOption } from "@/state";
import { onClickOutside } from "@vueuse/core";
import { nextTick, onMounted, ref, watch } from "vue";
import { useContextMenu } from ".";
const menu = ref<HTMLElement>();
const contextMenu = useContextMenu();
onClickOutside(menu, () => contextMenu.state.isVisible = false);
onMounted(() => updatePosition());
watch([() => contextMenu.state.position.x, () => contextMenu.state.position.y], () => nextTick(updatePosition));

const runAction = (option: IContextMenuOption) => {
  option.action();
  contextMenu.state.isVisible = false;
};

const updatePosition = () => {
  if (menu.value) {
    const { innerWidth, innerHeight } = window;
    const { x, y } = contextMenu.state.position;
    const menuWidth = menu.value.offsetWidth;
    const menuHeight = menu.value.offsetHeight;

    let newX = x;
    let newY = y;

    // overflows right
    if (x + menuWidth > innerWidth) newX = x - menuWidth;

    // overflows bottom
    if (y + menuHeight > innerHeight) newY = y - menuHeight;

    // left
    if (newX < 0) newX = 0;

    // top, you get the point.
    if (newY < 0) newY = 0;

    Object.assign(menu.value.style, {
      left: `${newX}px`,
      top: `${newY}px`,
    });
  }
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
