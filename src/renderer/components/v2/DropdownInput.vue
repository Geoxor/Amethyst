<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside, useVModel } from "@vueuse/core";
import { ChevronIcon } from "@/icons";

const showdropdown = ref(false);
const dropdown = ref(null);

const closedropdown = () => {
  showdropdown.value = false;
};

onClickOutside(dropdown, () => closedropdown());

const props = defineProps<{ modelValue?: number | string, options: (string | number)[]}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<template>
  <button
    class="flex relative cursor-pointer gap-1 items-center bg-accent bg-opacity-15 text-accent py-2 px-4 text-13px font-semibold rounded-8px gap-2"
    :class="showdropdown && 'active'"
    @click="showdropdown = true;"
  >
    {{ value }}
    <ChevronIcon class="w-4 h-4" />
    <transition name="slide">
      <menu
        v-if="showdropdown"
        ref="dropdown"
        class="dropdown absolute flex flex-col justify-start top-6 -right-0  p-1 rounded-8px bg-surface-600 z-10"
      >
        <button
          v-for="(option, i) in options"
          :key="`Lang${i}`"
          class="flex items-center gap-2 py-2 px-4 flex w-full justify-start hover:bg-surface-400 font-semibold text-text_title rounded-6px"
          :value="option"
          :class="option == value && 'active'"
          @click="emits('update:modelValue', option)"
        >
          {{ option }}
        </button>
      </menu>
    </transition>
  </button>
</template>

<style scoped lang="postcss">
.dropdown .active {
  @apply bg-primary text-surface-900;
}

button.active {
  @apply text-primary;
}

.slide-enter-active,
.slide-leave-active {
  @apply duration-100 opacity-100 translate-y-0;
}

.slide-enter-from,
.slide-leave-to {
  @apply opacity-0 transform-gpu translate-y-4;
}
</style>