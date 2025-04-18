<script setup lang="ts">
import SettingsNavigation from "@/components/v2/SettingsNavigation.vue";
import ResizableDiv from "../ResizableDiv";

import {ref, onMounted, onBeforeUnmount} from "vue";

let hiddenNavigation = ref<HTMLElement | null>(null);
let resizingParent = ref<HTMLElement | null>(null);
let observer: ResizeObserver | null = null;

function onResize() {
  if (!hiddenNavigation.value) return;
  if (!resizingParent.value) return;
  console.log(hiddenNavigation.value.getBoundingClientRect().width);

  const width = hiddenNavigation.value.offsetWidth;
  resizingParent.value.style.setProperty("--default-settings-nav-width", `${width + 10}px`);
}

onMounted(() => {
  if (!hiddenNavigation.value) return;
  if (!resizingParent.value) return;
  observer = new ResizeObserver(onResize);
  observer.observe(hiddenNavigation.value);
  onResize();
});

onBeforeUnmount(() => {
  if (!observer) return;
  observer.disconnect();
  observer = null;
});

</script>

<template>
  <div class="opacity-0 absolute pointer-events-none">
    <div
      ref="hiddenNavigation"
      class="w-min"
    >
      <settings-navigation :fullwidth-min="true" />
    </div>
  </div>
  <div
    ref="resizingParent"
    class="contents"
  >
    <resizable-div
      class="min-w-min"
      container-class="flex flex-col"
      name="settings-navigation"
      side="right"
      default-size="var(--default-settings-nav-width)"
      :handles-visible="true"
    >
      <settings-navigation :fullwidth-min="false" />
    </resizable-div>
  </div>
</template>
