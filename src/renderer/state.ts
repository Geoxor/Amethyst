import { useLocalStorage } from "@vueuse/core";
import { reactive, ref, watch } from "vue";
import type { MediaSourceType } from "./logic/mediaSources";
import { FONT_WEIGHTS } from "@shared/constants";
import { EventEmitter } from "./logic/eventEmitter";
import type { RtAudioDeviceInfo } from "audify";

export interface IContextMenuOption {
	title: string;
	icon?: any;
	shortcuts?: string[];
	red?: boolean;
	action: () => any;
}

export interface StateEvents {
	"theme:change": string;
}

export class State extends EventEmitter<StateEvents> {
	public window = reactive({
		isMinimized: false,
		isFocused: true,
		isCheckingForUpdates: false,
		isMaximized: false,
		isShowingBigCover: false,
		updateReady: false,
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
		processingConcurrency: 3,
		showAmbientBackground: false,
		ambientBackgroundOpacity: 10,
		ambientBackgroundSpin: true,
		ambientBackgroundBlurStrength: 32,
		ambientBackgroundSpinSpeed: 64,
		ambientBackgroundZoom: 130,
		ambientBackgroundBlendMode: "color-dodge",
		theme: "amethyst-dark",
		vectorscopeLineThickness: 1,
		showPlaybackControls: true,
		autoPlayOnStartup: false,
		followQueue: false,
		showInspector: true,
		showOutputDiagram: false,
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
		resampleRate: 44100,
		zoomLevel: 1.00,
		compactList: true,
		columns: {
			cover: true,
			artist: true,
			title: true,
			album: true,
			year: true,
			genre: true,
			bitrate: true,
			sampleRate: true,
			duration: true,
			trackNumber: true,
			location: true,
			format: true,
			favorite: true,
			size: true,
		},
		animationDuration: 100, // 100ms
		fetchMetadataOnStartup: true,
		meterSmoothingDuration: 100,
		bufferSize: 128,
		outputAudioDeviceName: "default",
		outputRealtimeAudioDeviceName: "",
		audioDriver: "default",
		language: "en-US",
		saveMediaSources: [{}] as {type: MediaSourceType, path: string}[],
	};

	public settings = useLocalStorage("settings", this.defaultSettings, { writeDefaults: true, mergeDefaults: true });

	public realtimeDevices = ref<RtAudioDeviceInfo[]>([]);
	
	public applyCurrentTheme = () => {
		if (typeof document !== "undefined") {
			const dom = document.querySelector("html");
			dom!.className = `theme-${this.settings.value.theme}`;
		}
		this.emit("theme:change", this.settings.value.theme);
	};

	constructor() {
		super();
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

    window.electron.ipcRenderer.invoke<RtAudioDeviceInfo[]>("get-realtime-devices").then(devices => {
      this.realtimeDevices.value = devices;
    });

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

		watch(() => this.settings.value.theme, () => {
			this.applyCurrentTheme();
		});
	}
}