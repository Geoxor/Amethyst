import type { Ref } from "vue";
import { computed, reactive, ref } from "vue";

export const COVERART_RENDERING_CONCURRENCY = 3;

const electron = window.electron.ipcRenderer;

const state = reactive({
	allowedExtensions: [] as string[],
	queue: [] as string[],
	currentlyPlaying: -1,
	volume: 1,
	version: "",
	isPlaying: false,
	isMinimized: false,
	isMaximized: false,
	processQueue: 0,
});

export const isDev = computed(() => state.version.includes("DEV"));
export const useState = () => state;
export const useInvoke = () => electron.invoke;
export const defaultCover = ref();

export const syncWindowState = async () => {
	const windowState = await electron.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
	state.isMinimized = windowState.isMinimized;
	state.isMaximized = windowState.isMaximized;
};

electron.on<string>("play-file", (file) => {
	if (file === "--require")
return;
	state.queue.unshift(file);
	state.currentlyPlaying = 0;
});
electron.on<(string)[]>("play-folder", files => state.queue = spreadArray(files));
electron.on("maximize", () => state.isMaximized = true);
electron.on("unmaximize", () => state.isMaximized = false);

// These are constant state syncs that get emitted on startup from the main process
electron.on<string>("version", version => state.version = version);
electron.on<string[]>("allowed-extensions", allowedExtensions => state.allowedExtensions = allowedExtensions);
electron.on<Buffer>("default-cover", image => defaultCover.value = URL.createObjectURL(new Blob([image], { type: "image/png" })));

// recursively goes through every file in the folder and flattens it
function spreadArray(array: string[]): string[] {
	return array.reduce((acc, item) => {
		if (Array.isArray(item))
			return acc.concat(spreadArray(item));
		else
			return acc.concat(item);
	}, [] as string[]);
}

export const getCoverArt = async (path: string, ref: Ref<string>) => {
  if (state.processQueue < COVERART_RENDERING_CONCURRENCY) {
    state.processQueue++;
    try {
      ref.value = await window.electron.ipcRenderer.invoke<string>("get-cover", [path]);
    }
    catch (error) { }
    state.processQueue--;
  }
  else {
    setTimeout(async () =>
      getCoverArt(path, ref), 100,
    );
  }
};
