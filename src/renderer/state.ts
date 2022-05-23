import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export const OVERALL_CONCURRENCY = 6;
export const COVERART_RENDERING_CONCURRENCY = OVERALL_CONCURRENCY / 2;
export const BPM_COMPUTATION_CONCURRENCY = OVERALL_CONCURRENCY / 2;

export default class AppState {
	public state = reactive({
		allowedExtensions: [] as string[],
		version: "",
		isMinimized: false,
		isMaximized: false,
		coverProcessQueue: 0,
		bpmProcessQueue: 0,
		coverCache: useLocalStorage<Record<string, string>>("cover-cache", {}),
		bpmCache: useLocalStorage<Record<string, number>>("bpm-cache", {}),
		defaultCover: "",
	});

	public coverArtCacheSize = computed(() => JSON.stringify(this.state.coverCache).length);
	public bpmCacheSize = computed(() => JSON.stringify(this.state.bpmCache).length);
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
