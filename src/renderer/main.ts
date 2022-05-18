import "virtual:windi.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

const state = reactive({
	openedFile: "",
	repeat: false,
});

export const useState = () => state;

window.electron.ipcRenderer.on("open-file", (file) => {
	state.openedFile = file as string;
});

