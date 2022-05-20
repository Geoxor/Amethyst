import "virtual:windi.css";
import "./app.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

const state = reactive({
	openedFile: "",
	isPlaying: false,
});

export const useState = () => state;
export const useInvoke = () => window.electron.ipcRenderer.invoke;

window.electron.ipcRenderer.on("play-file", (file) => {
	state.openedFile = file as string;
});

