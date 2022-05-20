import "virtual:windi.css";
import "./app.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp, reactive, ref } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

