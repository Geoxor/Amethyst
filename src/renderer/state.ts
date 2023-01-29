import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export interface IContextMenuOption {
	title: string;
	icon?: any;
	shortcuts?: string[];
	red?: boolean;
	action: () => any;
}

export class Store {
	public state = reactive({
		cpuUsage: {
			node: 0,
			renderer: 0
		},
		version: "",
		isMinimized: false,
		isFocused: true,
		isMaximized: false,
		isShowingBigCover: false,
		updateReady: false,
		defaultCover: "",
		theme: "amethyst-dark",
	});

	public defaultSettings = {
		showQueue: true,
		showCoverArt: true,
		showSpectrum: true,
		showBigSpectrum: false,
		showVectorscope: true,
		processingConcurrency: 3,
		showDbMeter: true,
		showAmbientBackground: false,
		ambientBackgroundOpacity: 32,
		ambientBackgroundSpin: true,
		ambientBackgroundBlurStrength: 0,
		ambientBackgroundSpinSpeed: 32,
		ambientBackgroundZoom: 125,
		ambientBackgroundBlendMode: "screen",
		spectrumVerticalZoom: 1.4,
		spectrumFftSize: 8192,
		spectrumSmoothing: 0.7,
		vectorscopeLineThickness: 1,
		showPlaybackControls: true,
		followQueue: false,
		showInspector: true,
		isSnappingToGrid: false,
		diagonalVectorscope: true,
		showLoudnessMeter: true,
		useLogarithmicSpectrum: true,
		useVsync: true,
		showBigVectorscope: false,
		useDiscordRichPresence: true,
		smoothScrollSpeed: 0.075,
		playOnStartup: false,
	};

	public settings = useLocalStorage("settings", this.defaultSettings, { writeDefaults: true }).value;
	public isDev = computed(() => this.state.version.includes("dev"));

	// TODO: Refactor context menus to its own class & manager

	public applyCurrentTheme = () => {
		if (typeof document !== "undefined") {
			const dom = document.querySelector("html");
			dom!.className = `theme-${this.state.theme}`;
		}
	};

	constructor() {
		this.applyCurrentTheme();
		Object.keys(this.defaultSettings).forEach(key => {
			// @ts-ignore
			if (this.settings[key] === undefined || this.settings[key] === null)
				// @ts-ignore
				this.settings[key] = this.defaultSettings[key];
		});

	}
}