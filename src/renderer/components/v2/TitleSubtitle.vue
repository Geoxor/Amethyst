<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { onBeforeUnmount, onMounted, ref } from "vue";
import SubtitleText from "./SubtitleText.vue";
import TitleText from "./TitleText.vue";
const props = defineProps<{ title?: string, subtitle?: string; alignment?: "left" | "center" | "right", subtitleEllipses?: boolean }>();

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
    class="flex flex-col gap-5px text-left py-1"
    :class="[
      alignment == 'left' && 'text-left',
      alignment == 'center' && 'text-center',
      alignment == 'right' && 'text-right',
      subtitleEllipses && 'w-full',
    ]"
  >
    <div
      ref="titleRef"
      class="w-full"
    >
      <title-text
        :text="title ?? 'Title'"
        class="duration-user-defined"
      />
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