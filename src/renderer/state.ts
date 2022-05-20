import { reactive, ref } from "vue";

const electron = window.electron.ipcRenderer;

const state = reactive({
	openedFile: "",
	volume: 1,
	isPlaying: false,
	isMinimized: false,
	isMaximized: false,
});

export const useState = () => state;
export const useInvoke = () => electron.invoke;
export const defaultCover = ref();

export const syncWindowState = async () => {
	const windowState = await electron.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
	state.isMinimized = windowState.isMinimized;
	state.isMaximized = windowState.isMaximized;
};

electron.on("play-file", file => state.openedFile = file as string);
electron.on("default-cover", (image) => {
	defaultCover.value = URL.createObjectURL(new Blob([image as Buffer], { type: "image/png" }));
});

