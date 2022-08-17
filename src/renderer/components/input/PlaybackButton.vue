<template>
  <div class="text-[#141414] relative" @mousedown="handleMouseDown">
    <component :is="icon" class="absolute select-none left-1/2 transform-gpu -translate-x-1/2"
      :class="isClicked || isActive ? 'top-7px' : 'top-5px '" />
    <svg v-if="!isClicked && !isActive" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#424681" d="M4 22h16v2H4zM4 0h16v2H4zM0 20V4h2v16zM22 20V4h2v16z" />
      <path fill="#fff" d="M2 2h20v16H2z" />
      <path fill="#686BDC" d="M2 18h20v4H2zM2 18h2v-2H2zM20 18h2v-2h-2z" />
      <path fill="#424681" d="M2 4V2h2v2zM2 22v-2h2v2zM20 4V2h2v2zM20 22v-2h2v2z" />
    </svg>
    <template v-else>
      <svg v-if="isActive" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#424681" d="M4 22h16v2H4zM4 2h16v2H4zM0 20V6h2v14zM22 20V6h2v14z" />
        <path fill="#CED0FF" d="M2 4h20v16H2z" />
        <path fill="#686BDC" d="M2 20h20v2H2zM2 20h2v-2H2zM20 20h2v-2h-2z" />
        <path fill="#424681" d="M2 6V4h2v2zM2 22v-2h2v2zM20 6V4h2v2zM20 22v-2h2v2z" />
      </svg>
      <svg v-else width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#424681" d="M4 22h16v2H4zM4 2h16v2H4zM0 20V6h2v14zM22 20V6h2v14z" />
        <path fill="#fff" d="M2 4h20v16H2z" />
        <path fill="#686BDC" d="M2 20h20v2H2zM2 20h2v-2H2zM20 20h2v-2h-2z" />
        <path fill="#424681" d="M2 6V4h2v2zM2 22v-2h2v2zM20 6V4h2v2zM20 22v-2h2v2z" />
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
defineProps<{ isActive?: boolean, icon: any }>();
const emits = defineEmits(['pressed']);

const isClicked = ref(false);

const handleMouseDown = () => {
  isClicked.value = true;
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseUp = () => {
  isClicked.value = false;
  emits("pressed");
  document.removeEventListener('mouseup', handleMouseUp);
};

</script>

<style scoped lang="postcss">
</style>