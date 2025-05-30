import { FONT_WEIGHTS } from "@shared/constants.js";
import { useLocalStorage } from "@vueuse/core";
import type { RtAudioDeviceInfo } from "audify";
import { reactive, ref, watch } from "vue";

import { EventEmitter } from "@/logic/eventEmitter.js";
import { createDefaultSettings } from "@/logic/settings.js";
import { ShaderManager } from "@/shaders/ShaderManager.js";

import { Amethyst } from "./amethyst.js";

function deepMerge<T>(target: T, source: Partial<T>): T {
	if (typeof target !== "object" || typeof source !== "object" || !target || !source) {
		return source as T;
	}

	const result = Array.isArray(target) ? [...target] : { ...target };

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const sourceVal = source[key];
			const targetVal = (target as any)[key];

			if (
				sourceVal &&
				typeof sourceVal === "object" &&
				!Array.isArray(sourceVal) &&
				targetVal &&
				typeof targetVal === "object" &&
				!Array.isArray(targetVal)
			) {
				(result as any)[key] = deepMerge(targetVal, sourceVal);
			} else {
				(result as any)[key] = sourceVal;
			}
		}
	}

	return result as any;
}

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

	public showBigSpectrum = ref(false);
	public showOutputDiagram = ref(false);
	public showCommandPalette = ref(false);
	public followQueue = ref(false);
	public isSnappingToGrid = ref(false);
	public zoomLevel = useLocalStorage("zoomValue", 1);

	public defaultSettings = createDefaultSettings(this.amethyst.getCurrentPlatform());

	public settings = reactive({
		...useLocalStorage("settings", this.defaultSettings, {
			writeDefaults: true,
			mergeDefaults: (storageValue, defaults) => {
				return deepMerge(structuredClone(defaults), storageValue);
			}
		}).value
	});

	public shaders = ref<ShaderManager>(new ShaderManager());

	public realtimeDevices = ref<RtAudioDeviceInfo[]>([]);

	public applyCurrentTheme = () => {
		if (typeof document !== "undefined") {
			const dom = document.querySelector("html");
			dom!.className = `theme-${this.settings.appearance.theme}`;
		}
		this.emit("theme:change", this.settings.appearance.theme);
	};

	constructor(private amethyst: Amethyst) {
		super();
		this.applyCurrentTheme();
		Object.keys(this.defaultSettings).forEach(key => {
			// @ts-ignore
			if (this.settings[key] === undefined || this.settings[key] === null)
				// @ts-ignore
				this.settings[key] = this.defaultSettings[key];
		});

		// Load from persistance
		document.documentElement.style.setProperty("--transition-duration", `${this.settings.appearance.animationDuration}ms`);
		document.documentElement.style.setProperty("--smoothing-duration", `${this.settings.metering.decibelMeter.smoothingDuration}ms`);
		document.documentElement.style.setProperty("--font-weight", `${(FONT_WEIGHTS.indexOf(this.settings.appearance.fontWeight) + 1) * 100}`);

		if (!["ios", "android"].includes(this.amethyst.getCurrentOperatingSystem())) {
			window.electron.ipcRenderer.invoke<RtAudioDeviceInfo[]>("get-realtime-devices").then(devices => {
				this.realtimeDevices.value = devices;

				// Check if it's the first time and populate so when user selects asio for the first time
				// it doesn't bug out
				if (this.settings.audio.outputRealtimeDeviceName == "") {
					this.settings.audio.outputRealtimeDeviceName = this.realtimeDevices.value[0].name;
				}
			});
		}


		// Update css when state changes
		watch(() => this.settings.appearance.animationDuration, newValue => {
			document.documentElement.style.setProperty("--transition-duration", `${newValue}ms`);
		});

		watch(() => this.settings.metering.decibelMeter.smoothingDuration, newValue => {
			document.documentElement.style.setProperty("--smoothing-duration", `${newValue}ms`);
		});

		watch(() => this.settings.appearance.fontWeight, newValue => {
			document.documentElement.style.setProperty("--font-weight", `${(FONT_WEIGHTS.indexOf(newValue) + 1) * 100}`);
		});

		watch(() => this.settings.appearance.theme, newThemeName => {
			this.applyCurrentTheme();
			this.emit("theme:change", newThemeName);
		});
	}
}