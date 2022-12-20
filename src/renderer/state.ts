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
		updateReady: false,
		defaultCover: "",
		theme: "amethyst-dark",
	});

	public defaultSettings = {
		showQueue: true,
		showSettings: false,
		showCoverArt: true,
		showSpectrum: true,
		showBigSpectrum: false,
		showVectorscope: true,
		processingConcurrency: 3,
		showDbMeter: true,
		showAmbientBackground: false,
		ambientBackgroundOpacity: 32,
		ambientBackgroundSpin: true,
		abmientBackgroundBlurStrength: 32,
		spectrumVerticalZoom: 1.4,
		ambientBackgroundZoom: 125,
		spectrumFftSize: 4096,
		spectrumSmoothing: 0.8,
		ambientBackgroundSpinSpeed: 24,
		vectorscopeLineThickness: 1,
		showPlaybackControls: true,
		followQueue: false,
		showInspector: true,
		isSnappingToGrid: false,
		diagonalVectorscope: true,
		useLogarithmicSpectrum: true,
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