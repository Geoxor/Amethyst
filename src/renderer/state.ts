import { reactive, ref } from "vue";

const electron = window.electron.ipcRenderer;

const state = reactive({
	queue: ["F:/MusicPlaylistFlac/Aether (2021)/Geoxor - Aether.flac"] as string[],
	currentlyPlaying: -1,
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

electron.on("play-file", (file) => {
	state.queue.push(file as string);
	state.currentlyPlaying = 0;
});
electron.on<(string | string[])[]>("play-folder", (files) => {
	// recursively go through every file in the folder
	// and puse it into the queue
	const queue = files.reduce((acc, file) => {
		if (file instanceof Array)
			return [...acc, ...file];
 		else
			return [...acc, file];
	}, []) as string[];

	state.queue = queue;
});
electron.on("maximize", () => state.isMaximized = true);
electron.on("unmaximize", () => state.isMaximized = false);
electron.on("default-cover", (image) => {
	defaultCover.value = URL.createObjectURL(new Blob([image as Buffer], { type: "image/png" }));
});

