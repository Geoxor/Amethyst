<template>
  <div id="contextMenu" role="contextMenu"
    class="absolute text-11px shadow-xl p-1 rounded-4px border-1 border-surface-600 bg-surface-800 z-100"
    ref="contextMenu">

    <ul class="flex flex-col min-w-32">
      <li v-for="option of state.state.contextMenu.options" @click="runAction(option)"
        class="p-2 hover:bg-surface-600 rounded-2px">
        <h1>{{ option.title }}</h1>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { useState } from '@/amethyst';
import { IContextMenuOption } from '@/state';
import { onClickOutside } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';

const state = useState();
const contextMenu = ref<HTMLElement>();
onClickOutside(contextMenu, () => state.state.contextMenu.isVisible = false)
onMounted(() => updatePositon())
watch(() => state.state.contextMenu.position.x, () => updatePositon())

const runAction = (option: IContextMenuOption) => {
  option.action();
  state.state.contextMenu.isVisible = false;
}

const updatePositon = () => {
  contextMenu.value && Object.assign(contextMenu.value.style, {
    left: `${state.state.contextMenu.position.x}px`,
    top: `${state.state.contextMenu.position.y}px`,
  });
}




</script>
