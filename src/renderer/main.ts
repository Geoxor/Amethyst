import "virtual:windi.css";
import "./app.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import AppState from "./state";

createApp(App).use(router).mount("#app");

class Amethyst {
  public appState: AppState = new AppState();
}

const app = new Amethyst();
