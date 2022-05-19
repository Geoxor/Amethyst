import "virtual:windi.css";
// Make this conditional if we are in dev mode
import "virtual:windi-devtools";
import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");

const state = reactive({
	// openedFile: "C:/Users/Geoxor/Desktop/ephemeral but without vocal chops.mp3",
	// openedFile: "X:/Backup/New Geoxor Projects/Electro House - Ether/Electro House - Ether v1.mp3",
	openedFile: "C:/Users/cimok_ft1srpf/Downloads/Geoxor_-_Heal_Her.mp3",
	isPlaying: false,
});

export const useState = () => state;

window.electron.ipcRenderer.on("open-file", (file) => {
	state.openedFile = file as string;
});

