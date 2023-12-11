<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { ChevronIcon } from "@/icons";
import { SUPPORTED_LOCALES, amethyst } from "@/amethyst";

const langs = ref(SUPPORTED_LOCALES);
const showLanguageDropdown = ref(false);
const languageDropdown = ref(null);

const closeLanguageDropdown = () => {
  showLanguageDropdown.value = false;
};

onClickOutside(languageDropdown, () => closeLanguageDropdown());

</script>

<template>
  <button
    class="flex relative gap-1 items-center bg-accent bg-opacity-15 text-accent py-2 px-4 text-13px font-semibold rounded-8px justify-between"
    :class="showLanguageDropdown && 'active'"
    @click="showLanguageDropdown = true;"
  >
    <ChevronIcon class="w-4 h-4" />
    {{ $i18n.locale }}
    <transition name="slide">
      <menu
        v-if="showLanguageDropdown"
        ref="languageDropdown"
        class="languageDropdown absolute w-42 flex flex-col justify-start top-8 -right-4  p-1 rounded-8px bg-surface-600"
      >
        <button
          v-for="(lang, i) in langs"
          :key="`Lang${i}`"
          class="flex items-center gap-2 py-2 px-4 flex w-full justify-start hover:bg-surface-400 font-semibold text-text_title rounded-6px"
          :value="lang"
          :class="$i18n.locale == lang && 'active'"
          @click="$i18n.locale = lang; amethyst.store.settings.value.language = lang;"
        >
          <img
            :src="`/flags/${lang}.svg`"
            class="h-3 w-auto rounded-2px"
          >
          {{ lang }}
        </button>
      </menu>
    </transition>
  </button>
</template>

<style scoped lang="postcss">
.languageDropdown .active {
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
  @apply opacity-0 transform-gpu translate-y-8;
}
</style>