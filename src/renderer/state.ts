import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export interface IContextMenuOption {
	title: string,
	action: () => any;
}

export class AppState {
	public state = reactive({
		allowedExtensions: [] as string[],
		cpuUsage: 0,
		version: "",
		isMinimized: false,
		isFocused: true,
		isMaximized: false,
		contextMenu: {
			isVisible: false,
			position: {
				x: 0,
				y: 0,
			},
			options: [] as IContextMenuOption[],
		},
		updateReady: false,
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
		showQueue: true,
		showNodeEditor: true,
		showSettings: false,
		useLogarithmicSpectrum: true,
		showMiniCovers: true,
		showCoverArt: true,
		spectrumVerticalZoom: 1.5,
		colorInterfaceFromCoverart: false,
		spectrumFftSize: 8192,
		vectorscopeLineThickness: 1,
		isSnappingToGrid: false,
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

	public openContextMenuAt(x: number, y: number, options: IContextMenuOption[]) {
		this.state.contextMenu.position = { x: x + 6, y: y + 6 };
		this.state.contextMenu.options = options;
		this.state.contextMenu.isVisible = true;
	}

	public applyCurrentTheme = () => {
		if (typeof document !== "undefined") {
			const dom = document.querySelector("html");
			dom!.className = `theme-${this.state.theme}`;
		}
	};

	constructor() {
		this.applyCurrentTheme();
		Object.keys(this.settingsObject).forEach(key => {
			// @ts-ignore
			if (this.settings[key] === undefined || this.settings[key] === null)
				// @ts-ignore
				this.settings[key] = this.settingsObject[key];
		});

	}
}