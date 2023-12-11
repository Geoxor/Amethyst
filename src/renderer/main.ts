
import "@/amethyst";
import App from "@/App.vue";
import "virtual:windi-devtools";
import "virtual:windi.css";
// @ts-ignore no types
import {RecycleScroller} from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { createI18n, I18n } from "vue-i18n";

import { createApp } from "vue";
import { router } from "@/router";
import { nextTick } from "vue";
import enUS from "./locales/en-US.json";

type MessageSchema = typeof enUS;

export const SUPPORTED_LOCALES = ["en-US", "fi-FI"] as const;
type SupportedLocales = typeof SUPPORTED_LOCALES[number];

const i18n = createI18n<[MessageSchema], "en-US">({
  fallbackLocale: "en-US", // set fallback locale
  messages: {
    "en-US": enUS,
  },
});

export async function loadLocaleMessages(i18n: I18n, locale: SupportedLocales) {
  // load locale messages with dynamic import
  const messages = await import(`./locales/${locale}.json`);

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}

const app = createApp(App);

app.component("RecycleScroller", RecycleScroller);
app.use(i18n);
app.use(router);
app.mount("#app");
