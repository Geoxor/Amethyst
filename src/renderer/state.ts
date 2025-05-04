import { useLocalStorage } from "@vueuse/core";
import {reactive, ref, watch} from "vue";
import type { MediaSourceType } from "./logic/mediaSources";
import { FONT_WEIGHTS } from "@shared/constants";
import { EventEmitter } from "./logic/eventEmitter";
import {ShaderManager} from "@/shaders/ShaderManager";
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
		isFullscreen: false,
		isShowingBigCover: false,
		updateReady: false,
	});

	public defaultSettings = {
		spectrogram: {
			show: true,
			smoothing: 0.5,
			fftSize: 8192,
		},
		shader: {
			use: false,
			selected: "none",
		},
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
			diskNumber: false,
			title: true,
			filename: false,
			album: true,
			year: true,
			bitsPerSample: true,
			genre: false,
			bitrate: true,
			sampleRate: true,
			barcode: false,
			label: false,
			isrc: false,
			copyright: false,
			bpm: false,
			duration: true,
			trackNumber: true,
			location: true,
			container: true,
			favorite: true,
			size: true,
		},
		animationDuration: 100, // 100ms
		fetchMetadataOnStartup: true,
		meterSmoothingDuration: 100,
		bufferSize: 256,
		outputAudioDeviceName: "default",
		outputRealtimeAudioDeviceName: "",
		audioDriver: "default",
		language: "en-US",
		saveMediaSources: [{}] as {type: MediaSourceType, path: string}[],
	};

	public settings = useLocalStorage("settings", this.defaultSettings, { writeDefaults: true, mergeDefaults: true });
	public shaders = ref<ShaderManager>(new ShaderManager());

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

			// Check if it's the first time and populate so when user selects asio for the first time
			// it doesn't bug out
			if (this.settings.value.outputRealtimeAudioDeviceName == "") {
				this.settings.value.outputRealtimeAudioDeviceName = this.realtimeDevices.value[0].name;
			}
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