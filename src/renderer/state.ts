import type { RemovableRef } from "@vueuse/core";
import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export const COVERART_RENDERING_CONCURRENCY = 10;

export default class AppState {
	public state = reactive({
		allowedExtensions: [] as string[],
		version: "",
		isMinimized: false,
		isMaximized: false,
		processQueue: 0,
		coverCache: useLocalStorage("cover-cache", {}) as RemovableRef<Record<string, string>>,
		defaultCover: "",
	});

	public totalLocalStorageSize = computed(() => JSON.stringify(this.state.coverCache).length);
	public isDev = computed(() => this.state.version.includes("DEV"));
}

// recursively goes through every file in the folder and flattens it

export function bytesToHuman(bytes: number): string {
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	if (bytes === 0)
		return "0 B";
	const i = ~~(Math.log(bytes) / Math.log(1024));
	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
