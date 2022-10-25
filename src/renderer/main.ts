import "@/app.pcss";
import "virtual:windi.css";
// Make this conditional if we are in dev mode
// import "virtual:windi-devtools";
import "@/amethyst";
import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";

const app = createApp(App);

app.use(router);
app.mount("#app");
