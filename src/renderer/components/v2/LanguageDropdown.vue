<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { Icon } from "@iconify/vue";
import { onClickOutside } from "@vueuse/core";
import iso6391 from "iso-639-1";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const showLanguageDropdown = ref(false);
const languageDropdown = ref(null);

const closeLanguageDropdown = () => {
  showLanguageDropdown.value = false;
};

onClickOutside(languageDropdown, () => closeLanguageDropdown());

const convertLocaleToLanguage = (locale: string) => {
    const [languageCode, countryCode] = locale.split("-");

    const languageName = iso6391.getName(languageCode);

    if (languageName && countryCode) {
      return `${languageName} (${countryCode})`;
    } else {
      return "Unknown";
    }
};

// For production we need to get the meta url
const flagURL = (name: string) => {
    // @ts-ignore
  return new URL(`/icons/flags/${name}.svg`, import.meta.url).toString();
};

// here

</script>

<template>
  <button
    class="flex relative gap-1 items-center bg-accent bg-opacity-15 text-accent  py-2 px-4 text-13px font-weight-user-defined rounded-8px gap-2"
    :class="showLanguageDropdown && 'active'"
    @click="showLanguageDropdown = true;"
  >
    <img
      :src="flagURL($i18n.locale.split('-')[1].toLocaleLowerCase())"
      class="w-4 rounded-2px"
    >
    {{ convertLocaleToLanguage($i18n.locale) }}
    <icon
      icon="ic:round-chevron-left"
      class="w-5 h-5 -rotate-90 transform-gpu" 
    />
    <transition name="slide">
      <menu
        v-if="showLanguageDropdown"
        ref="languageDropdown"
        class="languageDropdown absolute w-full flex flex-col justify-start top-6 -right-0  p-1 rounded-8px bg-surface-600"
      >
        <button
          v-for="(lang, i) in useI18n().availableLocales"
          :key="`Lang${i}`"
          class="flex items-center gap-2 py-2 px-4 flex w-full justify-start hover:bg-surface-400 font-weight-user-defined text-text-title rounded-6px"
          :value="lang"
          :class="$i18n.locale == lang && 'active'"
          @click="$i18n.locale = lang; amethyst.state.settings.application.language = lang;"
        >
          <img
            :src="flagURL(lang.split('-')[1].toLocaleLowerCase())"
            class="w-4 rounded-2px"
          >
          {{ convertLocaleToLanguage(lang) }}
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