import type { RemovableRef } from "@vueuse/core";
import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";
import ElectronEventManager from "./electronEventManager";
import Player from "./player";

export const COVERART_RENDERING_CONCURRENCY = 10;

export default class AppState {
	public electron: ElectronEventManager = new ElectronEventManager(this);
	public state = reactive({
		allowedExtensions: [] as string[],
		version: "",
		isMinimized: false,
		isMaximized: false,
		processQueue: 0,
		coverCache: useLocalStorage("cover-cache", {}) as RemovableRef<Record<string, string>>,
		defaultCover: "",
		player: new Player(this.electron),
	});

	totalLocalStorageSize = computed(() => JSON.stringify(this.state.coverCache).length);
	isDev = computed(() => this.state.version.includes("DEV"));

	getCoverArt = async (path: string) => {
		if (this.state.processQueue < COVERART_RENDERING_CONCURRENCY) {
			this.state.processQueue++;
			try {
				this.state.coverCache[path] = await this.electron.invoke<string>("get-cover", [path]);
			}
			catch (error) { }
			this.state.processQueue--;
		}
		else {
			setTimeout(async () =>
				this.getCoverArt(path), 100,
			);
		}
	};
}

const state = new AppState();
export const useState = () => state;

// recursively goes through every file in the folder and flattens it

export function bytesToHuman(bytes: number): string {
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	if (bytes === 0)
		return "0 B";
	const i = ~~(Math.log(bytes) / Math.log(1024));
	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
