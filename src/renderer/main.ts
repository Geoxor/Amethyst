import "@/amethyst";
import "@/app.css";
import App from "@/App.vue";
import "virtual:windi-devtools";
import "virtual:windi.css";
// @ts-ignore no types
import {RecycleScroller} from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { createApp } from "vue";

const app = createApp(App);

app.component("RecycleScroller", RecycleScroller);
app.mount("#app");
