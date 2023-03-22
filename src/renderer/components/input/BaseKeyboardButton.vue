<script setup lang="ts">
import { useShortcuts, useState } from "@/amethyst";
import { KeyFilter, onKeyDown, onKeyUp } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
const props = defineProps<{
  button: KeyFilter,
}>();

let active = ref(false);

onMounted(() => {
  if (props.button === "CTRL") {
    watch(() => useShortcuts().isControlPressed.value, value => active.value = value);
  }
  else if (props.button === "SHIFT") {
    watch(() => useShortcuts().isShiftPressed.value, value => active.value = value);
  }
  else if (props.button === "ALT") {
    watch(() => useShortcuts().isAltPressed.value, value => active.value = value);
  }
  else {
    // Deals with lowercase and uppercase
    onKeyDown(props.button, () => active.value = true);
    onKeyDown(props.button.toString().toLocaleLowerCase(), () => active.value = true);
    onKeyUp(props.button, () => active.value = false);
    onKeyUp(props.button.toString().toLocaleLowerCase(), () => active.value = false);
  }

  // Fixes sticky buttons when a popup happens and we lose focus
  watch(() => useState().state.isFocused, isFocused => {
    if (!isFocused) active.value = false;
  });
});

</script>

<template>
  <kbd
    class="text-7px font-aseprite"
    :class="[active && 'active']"
  >
    <slot />
  </kbd>
</template>

<style scoped lang="postcss">
kbd {
  @apply mx-0.25 py-0.25 px-1.25 rounded-3px border-1 border-surface-900 bg-surface-600;
  line-height: 1.4;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 2px rgb(var(--surface-600));

  &.active {
    @apply border-primary-700 bg-primary-800 text-black;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 2px rgb(var(--primary-800));
  }
}
</style>
