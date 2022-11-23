import { useLocalStorage } from "@vueuse/core";
import { computed, reactive } from "vue";

export interface IContextMenuOption {
	title: string,
	icon?: any,
	shortcuts?: string[]
	action: () => any;
}

export class AppState {
	public state = reactive({
		allowedExtensions: [] as string[],
		cpuUsage: {
			node: 0,
			renderer: 0
		},
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
		defaultCover: "",
		theme: "amethyst-dark",
	});

	public defaultSettings = {
		showQueue: true,
		showSettings: false,
		showCoverArt: true,
		showSpectrum: true,
		showVectorscope: true,
		processingConcurrency: 10,
		showDbMeter: true,
		showAmbientBackground: false,
		ambientBackgroundOpacity: 25,
		abmientBackgroundBlurStrength: 64,
		spectrumVerticalZoom: 1.4,
		spectrumFftSize: 4096,
		spectrumSmoothing: 0.8,
		vectorscopeLineThickness: 1,
		followQueue: false,
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
		Object.keys(this.defaultSettings).forEach(key => {
			// @ts-ignore
			if (this.settings[key] === undefined || this.settings[key] === null)
				// @ts-ignore
				this.settings[key] = this.defaultSettings[key];
		});

	}
}