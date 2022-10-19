import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export default class AppState {
	public state = reactive({
		allowedExtensions: [] as string[],
		cpuUsage: 0,
		version: "",
		isMinimized: false,
		isMaximized: false,
		processQueue: new Set(),
		coverProcessQueue: 0,
		bpmProcessQueue: 0,
		coverCache: useLocalStorage<Record<string, string>>("cover-cache", {}),
		bpmCache: useLocalStorage<Record<string, number>>("bpm-cache", {}),
		waveformCache: useLocalStorage<Record<string, ImageBitmap>>("waveform-cache", {}),
		defaultCover: "",
		theme: "amethyst-dark",
	});

	public settingsObject = {
		useLogarithmicSpectrum: true,
		showMiniCovers: true,
		showCoverArt: true,
		spectrumVerticalZoom: 1.5,
		colorInterfaceFromCoverart: false,
		spectrumFftSize: 8192,
		vectorscopeLineThickness: 1,
		diagonalVectorscope: true,
		spectrumSmoothing: 0.5,
		showSpectrum: true,
		showVectorscope: true,
		showDbMeter: true,
		smoothScrollSpeed: 0.075,
		playOnStartup: false,
		discordRichPresence: true,
	};

	public settings = useLocalStorage("settings", this.settingsObject, { writeDefaults: true }).value;

	public coverArtCacheSize = computed(() => JSON.stringify(this.state.coverCache).length);
	public bpmCacheSize = computed(() => JSON.stringify(this.state.bpmCache).length);
	public waveformCacheSize = computed(() => JSON.stringify(this.state.waveformCache).length);
	public isDev = computed(() => this.state.version.includes("DEV"));

	public applyCurrentTheme = () => {
		if (typeof document !== "undefined") {
			const dom = document.querySelector("html");
			dom!.className = `theme-${this.state.theme}`;
		}
	};

	constructor() {
		this.applyCurrentTheme();
		Object.keys(this.settingsObject).forEach((key) => {
			// @ts-ignore
			if (this.settings[key] === undefined || this.settings[key] === null)
				// @ts-ignore
				this.settings[key] = this.settingsObject[key];
		});

	}
}