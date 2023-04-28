
import "@/amethyst";
import App from "@/App.vue";
import "virtual:windi-devtools";
import "virtual:windi.css";
// @ts-ignore no types
import {RecycleScroller} from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

import { createApp } from "vue";
import { router } from "@/router";

const app = createApp(App);

app.component("RecycleScroller", RecycleScroller);
app.use(router);
app.mount("#app");
