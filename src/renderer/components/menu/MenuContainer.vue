<script lang="ts" setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { computed, inject, ref } from "vue";

import TitleText from "../v2/TitleText.vue";

const props = defineProps<{ title: string }>();
const menuGroupRef = inject<{ value: {
  activeMenu: string | null
} }>("menuGroupRef", {
  value: { activeMenu: null } 
});

const menuContainer = ref<HTMLElement>();

const isShowing = computed(() => menuGroupRef.value.activeMenu === props.title);

onKeyStroke("Escape", () => menuGroupRef.value && (menuGroupRef.value.activeMenu = null));

const onMouseEnter = () => {
  if (menuGroupRef.value.activeMenu) menuGroupRef.value.activeMenu = props.title;
};

const onClick = () => {  
  if (menuGroupRef.value.activeMenu === props.title) 
    menuGroupRef.value.activeMenu = null;
  else 
    menuGroupRef.value.activeMenu = props.title;
};

onClickOutside(
  menuContainer,
  () => {
    if (menuGroupRef.value.activeMenu === props.title) 
      menuGroupRef.value.activeMenu = null;
  },
  { ignore: [menuContainer] }
);

</script>

<template>
  <div 
    ref="menuContainer"
    class="menu relative h-full no-drag"
    @mouseenter="onMouseEnter"
  >
    <div
      :class="isShowing && 'text-accent bg-surface-600'"
      class="hover:text-accent hover:bg-surface-600 cursor-default flex rounded-b-8px items-center mt-0.25 px-3 h-full duration-user-defined" 
      @click.stop="onClick"
    >
      <title-text :text="title" />
    </div>
    <div
      v-if="isShowing"
      class="absolute z-30 flex select-none items-center bg-surface-800 shadow-xl rounded-8px border-solid border-1 border-surface-600 left-0 mt-1 py-1 flex-col w-96"
      @click="onClick"
    >
      <slot />
    </div>
  </div>
  <div
    v-if="isShowing"
    :class="isShowing && 'pointer-events-auto'"
    class="pointer-events-none z-20 top-10 left-0 absolute w-full h-full"
    @click="onClick"
  />
</template>