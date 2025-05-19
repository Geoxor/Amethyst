<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

import { amethyst } from "@/amethyst.js";

import BaseTooltip from "../BaseTooltip.vue";
import SubtitleText from "./SubtitleText.vue";
import TitleText from "./TitleText.vue";
const props = defineProps<{ title?: string, subtitle?: string; alignment?: "left" | "center" | "right", subtitleEllipses?: boolean, info?: string }>();

const titleRef = ref<HTMLDivElement>();
const subtitleRef = ref<HTMLDivElement>();

function onResizeTitle() {
  if (!titleRef.value) return;
  if (!subtitleRef.value) return;
  const titleWidth = titleRef.value.offsetWidth;
  subtitleRef.value.style.maxWidth = `${titleWidth}px`;
  subtitleRef.value.style.width = `${titleWidth}px`;
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  if (!props.subtitleEllipses) return;
  onResizeTitle();
  observer = new ResizeObserver(() => {
    onResizeTitle();
  });
  observer.observe(titleRef.value!);
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div
    class="flex flex-col gap-1 text-left py-1"
    :class="[
      alignment == 'left' && 'text-left',
      alignment == 'center' && 'text-center',
      alignment == 'right' && 'text-right',
      subtitleEllipses && 'w-full',
    ]"
  >
    <div
      ref="titleRef"
      class="w-full flex gap-1"
    >
      <title-text
        :text="title ?? 'Title'"
        class="duration-user-defined"
      />

      <base-tooltip
        text="Open manual"
        placement="top"
      >
          <Icon
            v-if="info"
            icon="mdi:information-slab-box-outline"  
            class="min-w-4 min-h-4 text-inspector-color cursor-external-pointer"
            @click="() => {
              amethyst.openLink(info!);
            }"
          />
        </base-tooltip>

    </div>
    <div
      v-if="!amethyst.state.settings.appearance.minimalistMode"
      class="contents"
    >
      <div
        v-if="subtitleEllipses"
        class="w-full"
      >
        <div class="w-0">
          <div
            ref="subtitleRef"
          >
            <subtitle-text
              :text="subtitle || 'Subtitle'"
              class="duration-user-defined"
            />
          </div>
        </div>
      </div>
      <subtitle-text
        v-else
        :text="subtitle || 'Subtitle'"
        class="duration-user-defined"
      />
    </div>
  </div>
</template>