
import 'virtual:uno.css';
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { createApp } from "vue";
// @ts-ignore no types
import { RecycleScroller } from "vue-virtual-scroller";

import { i18n } from "@/amethyst.js";
import App from "@/App.vue";
import { router } from "@/router.js";

const app = createApp(App);

app.component("RecycleScroller", RecycleScroller);
app.use(i18n);
app.use(router);
app.mount("#app");
