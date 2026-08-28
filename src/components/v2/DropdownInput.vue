<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onClickOutside, useVModel } from "@vueuse/core";
import { ref } from "vue";

const showdropdown = ref(false);
const dropdown = ref(null);

const closedropdown = () => {
  showdropdown.value = false;
};

onClickOutside(dropdown, () => closedropdown());

const props = defineProps<{ modelValue?: number | string; prefix?: string; suffix?: string; options: (string | number)[] }>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<template>
  <button
    class="flex min-w-32 justify-between relative cursor-pointer gap-1 items-center bg-surface-600 text-accent py-2 px-4 text-13px font-weight-user-defined rounded-4px gap-2"
    :class="showdropdown && 'active rounded-b-0px '"
    @click="showdropdown = true;"
  >
    <p class="text-13px font-weight-user-defined">
      <span class="opacity-75">{{ prefix }}</span> {{ value }} <span class="opacity-75">{{ suffix }}</span>
    </p>
    <icon
      icon="ic:round-chevron-left"
      class="w-5 h-5 -rotate-90 transform-gpu"
    />
    <transition name="slide">
      <menu
        v-if="showdropdown"
        ref="dropdown"
        class="dropdown absolute flex flex-col justify-start top-6 right-0 min-w-32 p-1  bg-surface-600  rounded-8px rounded-t-0px bg-surface-600 z-20"
      >
        <button
          v-for="(option, i) in options"
          :key="`Lang${i}`"
          class="flex items-center gap-2 py-2 px-4 flex w-full justify-start hover:bg-surface-400 font-weight-user-defined text-text-title rounded-6px"
          :value="option"
          :class="option == value && 'active'"
          @click="emits('update:modelValue', option)"
        >
          <p class="text-13px font-weight-user-defined mr-5">
            <span class="opacity-75">{{ prefix }}</span> {{ option }} <span class="opacity-75">{{ suffix }}</span>
          </p>
        </button>
      </menu>
    </transition>
  </button>
</template>

<style scoped lang="postcss">
.dropdown .active {
  @apply bg-accent/15 text-accent;
}

.slide-enter-active,
.slide-leave-active {
  @apply opacity-100 translate-y-0;
  transition-duration: var(--transition-duration);

}

.slide-enter-from,
.slide-leave-to {
  @apply opacity-0 transform-gpu translate-y-4;
}
</style>
