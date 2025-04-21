import { useLocalStorage } from "@vueuse/core";
import { reactive, watch } from "vue";
import { MediaSourceType } from "./logic/mediaSources";
import { FONT_WEIGHTS } from "@shared/constants";

export interface IContextMenuOption {
	title: string;
	icon?: any;
	shortcuts?: string[];
	red?: boolean;
	action: () => any;
}

export class Store {
	public state = reactive({
		isMinimized: false,
		isFocused: true,
		isCheckingForUpdates: false,
		isMaximized: false,
		isShowingBigCover: false,
		updateReady: false,
		theme: "amethyst-dark",
	});

	public defaultSettings = {
		showQueue: true,
		showCoverArt: true,
		coverGridSize: 128,
		showSpectrum: true,
		showBigSpectrum: false,
		spectrumFftSize: 8192,
		spectrumSmoothing: 0.5,
		showVectorscope: true,
		showDbMeter: true,
		showAmbientBackground: false,
		ambientBackgroundOpacity: 10,
		ambientBackgroundSpin: true,
		ambientBackgroundBlurStrength: 32,
		ambientBackgroundSpinSpeed: 64,
		ambientBackgroundZoom: 130,
		ambientBackgroundBlendMode: "color-dodge",
		vectorscopeLineThickness: 1,
		showPlaybackControls: true,
		followQueue: false,
		showInspector: true,
		isSnappingToGrid: false,
		lissajousVectorscope: true,
		showLoudnessMeter: true,
		useVsync: true,
		autoStart: false,
		autoUpdatesEnabled: true,
		showBigVectorscope: false,
		neonMode: false,
		useDiscordRichPresence: true,
		pauseVisualsWhenUnfocused: false,
		showDebugStats: false,
		smoothScrollSpeed: 0.075,
		playOnStartup: false,
		decibelMeterMinimumDb: -60,
		decibelMeterSeperatePrePost: false,
		minimalistMode: false,
		decibelMeterFftSize: 1024,
		vectorscopeFftSize: 512,
		fontWeight: "normal",
		hideCategoryTitles: true,
		zoomLevel: 1.00,
		animationDuration: 100, // 100ms
		fetchMetadataOnStartup: true,
		meterSmoothingDuration: 100,
		language: "en-US",
		saveMediaSources: [{}] as {type: MediaSourceType, path: string}[],
	};

	public settings = useLocalStorage("settings", this.defaultSettings, { writeDefaults: true, mergeDefaults: true });

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

		// Load from persistance
		document.documentElement.style.setProperty("--transition-duration", `${this.settings.value.animationDuration}ms`);
		document.documentElement.style.setProperty("--smoothing-duration", `${this.settings.value.meterSmoothingDuration}ms`);
		document.documentElement.style.setProperty("--font-weight", `${(FONT_WEIGHTS.indexOf(this.settings.value.fontWeight) + 1) * 100}`);

		// Update css when state changes
		watch(() => this.settings.value.animationDuration, newValue => {
			document.documentElement.style.setProperty("--transition-duration", `${newValue}ms`);
		});

		watch(() => this.settings.value.meterSmoothingDuration, newValue => {
			document.documentElement.style.setProperty("--smoothing-duration", `${newValue}ms`);
		});

		watch(() => this.settings.value.fontWeight, newValue => {
			document.documentElement.style.setProperty("--font-weight", `${(FONT_WEIGHTS.indexOf(newValue) + 1) * 100}`);
		});
	}
}