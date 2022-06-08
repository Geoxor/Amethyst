import "virtual:windi.css";
import "./app.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./amethyst";

const app = createApp(App);

app.use(router);
app.mount("#app");
