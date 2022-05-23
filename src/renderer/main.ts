import "virtual:windi.css";
import "./app.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import AppState from "./state";
import Shortcuts from "./shortcuts";

createApp(App).use(router).mount("#app");

class Amethyst {
  public appState: AppState = new AppState();
  public shortcuts: Shortcuts = new Shortcuts();
}

const app = new Amethyst();
