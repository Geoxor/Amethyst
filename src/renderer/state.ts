import { reactive, ref } from "vue";

const electron = window.electron.ipcRenderer;

const state = reactive({
	allowedExtensions: [] as string[],
	queue: [] as string[],
	currentlyPlaying: 0,
	volume: 1,
	version: "",
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

electron.on("play-file", file => state.queue.push(file as string));
electron.on<(string)[]>("play-folder", (files) => {
	state.queue = spreadArray(files);
});
electron.on("maximize", () => state.isMaximized = true);
electron.on("unmaximize", () => state.isMaximized = false);

// These are constant state syncs that get emitted on startup from the main process
electron.on<string>("version", version => state.version = version);
electron.on<string[]>("allowed-extensions", allowedExtensions => state.allowedExtensions = allowedExtensions);
electron.on("default-cover", (image) => {
	defaultCover.value = URL.createObjectURL(new Blob([image as Buffer], { type: "image/png" }));
});

// recursively goes through every file in the folder and flattens it
function spreadArray(array: string[]): string[] {
	return array.reduce((acc, item) => {
		if (Array.isArray(item))
			return acc.concat(spreadArray(item));
		else
			return acc.concat(item);
	}, [] as string[]);
}
