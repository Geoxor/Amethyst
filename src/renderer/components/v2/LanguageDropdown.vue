<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { ChevronIcon } from "@/icons";
import { useI18n } from "vue-i18n";
import iso6391 from "iso-639-1";
import iso3166 from "iso-3166-1";
import { amethyst } from "@/amethyst";

const showLanguageDropdown = ref(false);
const languageDropdown = ref(null);

const closeLanguageDropdown = () => {
  showLanguageDropdown.value = false;
};

onClickOutside(languageDropdown, () => closeLanguageDropdown());

const convertLocaleToLanguage = (locale: string) => {
    const [languageCode, countryCode] = locale.split("-");

    const languageName = iso6391.getName(languageCode);
    const countryName = iso3166.whereCountry(countryCode)?.country;

    if (languageName && countryName) {
        return `${languageName} (${countryName})`;
    } else if (languageName) {
        return languageName;
    } else {
        return "Unknown";
    }
};

</script>

<template>
  <button
    class="flex relative gap-1 items-center bg-accent bg-opacity-15 text-accent w-32 py-2 px-4 text-13px font-semibold rounded-8px gap-2"
    :class="showLanguageDropdown && 'active'"
    @click="showLanguageDropdown = true;"
  >
    <img
      :src="`/flags/${$i18n.locale.split('-')[1].toLocaleLowerCase()}.svg`"
      class="w-4 rounded-2px"
    >
    {{ convertLocaleToLanguage($i18n.locale) }}
    <ChevronIcon class="w-4 h-4" />
    <transition name="slide">
      <menu
        v-if="showLanguageDropdown"
        ref="languageDropdown"
        class="languageDropdown absolute w-32 flex flex-col justify-start top-6 -right-0  p-1 rounded-8px bg-surface-600"
      >
        <button
          v-for="(lang, i) in useI18n().availableLocales"
          :key="`Lang${i}`"
          class="flex items-center gap-2 py-2 px-4 flex w-full justify-start hover:bg-surface-400 font-semibold text-text_title rounded-6px"
          :value="lang"
          :class="$i18n.locale == lang && 'active'"
          @click="$i18n.locale = lang; amethyst.store.settings.value.language = lang;"
        >
          <img
            :src="`/flags/${lang.split('-')[1].toLocaleLowerCase()}.svg`"
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