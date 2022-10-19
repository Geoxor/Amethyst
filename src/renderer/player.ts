import { useLocalStorage } from "@vueuse/core";
import type { IAudioMetadata } from "music-metadata";
import { computed, reactive, watch } from "vue";
import type ElectronEventManager from "./electronEventManager";
import type AppState from "./state";
import { FastAverageColorResult } from 'fast-average-color';
import mitt from 'mitt';
import { secondsToHuman } from "./logic/formating";

export const ALLOWED_EXTENSIONS = ["ogg", "flac", "wav", "opus", "aac", "aiff", "mp3", "m4a"];

export enum LoopMode {
	None,
	All,
	One,
}

export const Events = Object.freeze({
	"play": "" as string,
	"metadata": {} as { file: string } & IAudioMetadata,
	"pause": undefined,
	"setVolume": 0 as number,
	"seekTo": 0 as number,
})

export default class Player {
	private events = mitt<typeof Events>();
	private emit = this.events.emit;
	public on = this.events.on;
	public off = this.events.off;

	public state = reactive({
		inputAudio: new Audio(),
		outputAudio: new Audio(),
		richPresenceTimer: null as null | NodeJS.Timer,
		ctx: new window.AudioContext(),
		source: null as null | MediaElementAudioSourceNode,
		currentlyPlayingMetadata: null as null | IAudioMetadata,
		currentlyPlayingFilePath: useLocalStorage<string>("currentlyPlayingFilePath", ""),
		selectedOutputDeviceId: useLocalStorage<string>("selectedOutputDeviceId", ""),

		queue: useLocalStorage<Set<string>>("queue", new Set()),
		currentlyPlayingIndex: -1,
		volume: useLocalStorage<number>("volume", 1),
		isPlaying: false,
		loopMode: LoopMode.None,

		outputDevices: [] as MediaDeviceInfo[],
		inputDevices: [] as MediaDeviceInfo[],
	});

	constructor(public appState?: AppState, public electron?: ElectronEventManager) {
		// Ignore the --require arg we get in dev mode so we don't end up with "--require" as a path in the queue
		electron?.electron.on<string>("play-file", file => file !== "--require" && this.addToQueueAndPlay(file));
		electron?.electron.on<(string)[]>("play-folder", files => this.setQueue(files));
		electron?.electron.on<(string)[]>("load-folder", files => this.setQueue([...files, ...this.getQueue()]));

		// When the queue changes updated the current playing file path
		watch(() => this.state.queue.size, () => this.updateCurrentlyPlayingFilePath());

		// When the playing index changes update the current playing file path
		watch(() => this.state.currentlyPlayingIndex, () => this.updateCurrentlyPlayingFilePath());

		// Play again if the first element in the queue changes
		// (when the user dropped a file that already is in the queue but not at position 0)
		watch(() => this.getQueue()[0], () => this.updateCurrentlyPlayingFilePath());

		// When the currently playing file path changes play the new file
		watch(() => this.state.currentlyPlayingFilePath, () => this.loadSoundAndPlay(this.state.currentlyPlayingFilePath));

		this.getCovers(Array.from(this.state.queue));

		this.getOutputDevices().then(devices => this.state.outputDevices = devices);
		this.getInputDevices().then(devices => this.state.inputDevices = devices);

		// Prepare output node
		this.updateOutputDevice(this.state.selectedOutputDeviceId);

		// TODO: move the recolor logic somewhere else pls
		// Resets the colors when the user disables this setting in the state
		watch(() => this.appState?.settings.colorInterfaceFromCoverart, () => this.resetThemeColors())
	}

	public static fisherYatesShuffle<T>(array: T[]) {
		let m = array.length; let t; let i;
		while (m) {
			i = ~~(Math.random() * m--);

			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}

	public loopNone = () => {
		this.state.loopMode = LoopMode.None;
	}

	public loopOne = () => {
		this.state.loopMode = LoopMode.One;
	}

	public loopAll = () => {
		this.state.loopMode = LoopMode.All;
	}

	// TODO: fix this, substring fails when first starting cus getCurrentlyPlayingFilePath() returns null
	public getFilename = () => {
		const current = this.getCurrentlyPlayingFilePath() || "";
		return current.substring(Math.max(current.lastIndexOf("\\"), current.lastIndexOf("/")) + 1)
	}

	public getTitle = () => {
		return computed(() => this.state.currentlyPlayingMetadata?.common.title || this.getFilename()).value;
	}

	public getArtist = () => {
		return computed(() => this.state.currentlyPlayingMetadata?.common.artists?.join(" & ") || "unknown artist").value;
	}

	public getCoverBase64 = () => {
		this.getCoverArt(this.getCurrentlyPlayingFilePath())
		return computed(() => `data:image/png;base64,${this.appState?.state.coverCache[this.getCurrentlyPlayingFilePath()] || ""}`).value;
	}

	public hasCover = () => {
		return !!this.appState?.state.coverCache[this.getCurrentlyPlayingFilePath()];
	}

	public getOutputDevices = async () => {
		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind === 'audiooutput' && (device.deviceId !== "default" && device.deviceId !== "communications")).sort((a, b) => a.label.localeCompare(b.label));
	}

	public getInputDevices = async () => {
		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind === 'audioinput' && (device.deviceId !== "default" && device.deviceId !== "communications")).sort((a, b) => a.label.localeCompare(b.label));
	}

	private updateRichPresence = () => {
		// Discord rich presence timer that updates discord every second
		this.state.richPresenceTimer && clearInterval(this.state.richPresenceTimer);
		this.state.richPresenceTimer = setInterval(() => {
			(this.state.currentlyPlayingMetadata && this.appState?.settings.discordRichPresence) && this.electron?.invoke("update-rich-presence", [
				this.state.currentlyPlayingMetadata.common.artist ? `${this.state.currentlyPlayingMetadata.common.artist || "Unkown Artist"} - ${this.state.currentlyPlayingMetadata.common.title}` : this.state.currentlyPlayingFilePath.substring(this.state.currentlyPlayingFilePath.lastIndexOf("\\") + 1),
				secondsToHuman(this.state.currentlyPlayingMetadata.format.duration!),
				secondsToHuman(this.getCurrentTime()),
				this.state.isPlaying.toString(),
			]);
		}, 1000);
	}

	private updateCurrentMetadata(path: string) {
		this.electron?.invoke<IAudioMetadata>("get-metadata", [path]).then(
			(data) => {
				this.state.currentlyPlayingMetadata = data;
				this.emit("metadata", { file: path, ...data });
			});
	}

	private updateAppTitle = (path: string) => {
		// set the html title to the song name
		document.title = path || "Amethyst";
	}

	public updateOutputDevice = (deviceId: string) => {
		this.state.selectedOutputDeviceId = deviceId;
		// @ts-ignore - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId#examples
		this.state.outputAudio.setSinkId(deviceId);
	}

	public async loadSoundAndPlay(path: string) {
		// If there was another song playing stop it
		this.state.inputAudio && this.pause();

		// simple fix to folders that have # in their name
		this.state.inputAudio = new Audio(`file://${path.replace("#", "%23")}`);

		// Create a source out of the context
		this.state.source = this.state.ctx.createMediaElementSource(this.state.inputAudio);

		// Create a destination out of the context
		const destination = this.state.ctx.createMediaStreamDestination();

		// Connect the source to the destination
		this.state.source.connect(destination);

		// Create a new audio element that way we can change the audio output path
		this.state.outputAudio.srcObject = destination.stream;
		this.state.outputAudio.volume = this.state.volume;

		// Play the sound and handle playback
		this.play();
		this.state.inputAudio.onended = () => {
			const isLastInQueue = this.state.currentlyPlayingIndex == this.state.queue.size - 1;

			// TODO: move this logic in the play(); method
			switch (this.state.loopMode) {
				case LoopMode.None:
					return isLastInQueue ? this.pause() : this.next();
				case LoopMode.One:
					return this.play();
				case LoopMode.All:
					// If we are at the last song then start from the beginning
					console.log(isLastInQueue);

					if (isLastInQueue) {
						this.setCurrentlyPlayingIndex(0);
						return this.play();
					}

					// Otherwise play the next song
					return this.next();
			}
		};

		// Misc
		this.updateAppTitle(path);
		this.updateCurrentMetadata(path);
		this.updateRichPresence();
	}

	public spreadArray(array: string[]): string[] {
		return array.reduce((acc, item) => {
			if (Array.isArray(item))
				return acc.concat(this.spreadArray(item));
			else
				return acc.concat(item);
		}, [] as string[]);
	}

	public async getCovers(files: string[]): Promise<void> {
		for (const file of files) {
			if (this.appState?.state.coverCache[file]) continue;
			await this.getCoverArt(file);
		}
	}

	public getCoverArt = async (path: string) => {
		const cover = await this.electron?.invoke<string>("get-cover", [path]);
		if (this.appState) this.appState.state.coverCache[path] = cover as string
		return cover
	};

	private updateThemeColors = async (path: string) => {
		this.electron?.invoke<FastAverageColorResult>("get-cover-colors", [path])
			.then(color => {
				const [r, g, b] = color.value;

				const root = document.querySelector<HTMLElement>(':root')!;
				root.style.setProperty('--primary-900', `${r}, ${g}, ${b}`);
				root.style.setProperty('--primary-800', `${r - 5}, ${g - 5}, ${b - 5}`);

				const maximal = Math.max(r, g, b);

				const rRatio = r / maximal;
				const gRatio = g / maximal;
				const bRatio = b / maximal;

				const computeShade = (tint: number = 15, r: number, g: number, b: number): string => {
					return `${r + rRatio * tint}, ${g + gRatio * tint},  ${b + bRatio * tint}`
				}

				root.style.setProperty("--surface-900", computeShade(15, 20, 20, 20)); // 15, 17, 25
				root.style.setProperty("--surface-800", computeShade(20, 27, 27, 27)); // 20, 22, 33
				root.style.setProperty("--surface-700", computeShade(24, 32, 32, 32)); // 24, 26, 39
				root.style.setProperty("--surface-600", computeShade(31, 42, 42, 42)); // 31, 33, 52
				root.style.setProperty("--surface-500", computeShade(45, 59, 59, 59)); // 45, 45, 73
			})
			.catch(console.log)
	}

	public resetThemeColors = () => {
		const root = document.querySelector<HTMLElement>(':root')!;
		root.style.setProperty('--primary-900', `134, 138, 255`);
		root.style.setProperty('--primary-800', `100, 106, 195`);
		root.style.setProperty("--surface-900", `15, 17, 25`);
		root.style.setProperty("--surface-800", `20, 22, 33`);
		root.style.setProperty("--surface-700", `24, 26, 39`);
		root.style.setProperty("--surface-600", `31, 33, 52`);
		root.style.setProperty("--surface-500", `45, 45, 73`);
	}

	public play() {
		this.state.outputAudio.play();
		this.state.inputAudio.play();
		this.state.isPlaying = true;
		this.emit("play", this.state.currentlyPlayingFilePath);
		this.appState?.settings.colorInterfaceFromCoverart && this.updateThemeColors(this.state.currentlyPlayingFilePath);
	}

	public pause() {
		this.state.inputAudio.pause();
		this.state.isPlaying = false;
		this.emit("pause");
	}

	public next(skip = 1) {
		if ((this.state.currentlyPlayingIndex + skip) < (this.state.queue.size - skip))
			this.state.currentlyPlayingIndex++;
	}

	public previous(skip = 1) {
		if ((this.state.currentlyPlayingIndex - skip) > 0)
			this.state.currentlyPlayingIndex--;
	}

	public setVolume(volume: number) {
		this.state.outputAudio.volume = volume;
		this.state.volume = volume;
		this.emit("setVolume", volume);
	}

	public volumeUp(amount = 0.1) {
		this.setVolume(this.state.outputAudio.volume = Math.min(1, this.state.outputAudio.volume + amount));
	}

	public volumeDown(amount = 0.1) {
		this.setVolume(Math.max(0, this.state.outputAudio.volume - amount));
	}

	public addToQueueAndPlay(file: string) {
		if (ALLOWED_EXTENSIONS.includes(file.substring(file.lastIndexOf(".") + 1).toLowerCase())) {
			this.state.queue = new Set([file, ...this.getQueue()]);
			this.state.currentlyPlayingIndex = 0;
		}
	}

	public getQueue() {
		return Array.from(this.state.queue.values());
	}

	public setQueue(files: string[]) {
		this.state.queue = new Set(this.spreadArray(files));
		this.getCovers(files);
	}

	public clearQueue() {
		this.state.queue.clear();
	}

	public removeCurrentItemFromQueue() {
		this.removeItemFromQueue(this.getCurrentlyPlayingIndex());
	}

	public removeItemFromQueue(idx: number) {
		this.state.queue.delete(this.getQueue()[idx]);
	}

	public getCurrentTime() {
		return this.state.inputAudio.currentTime;
	}

	public seekTo(time: number) {
		this.state.inputAudio.currentTime = time;
	}

	public seekForward(step = 5) {
		this.seekTo(this.state.inputAudio.currentTime + step);
	}

	public seekBackward(step = 5) {
		this.seekTo(this.state.inputAudio.currentTime - step);
	}

	public isPlaying() {
		return this.state.isPlaying;
	}

	public shuffle() {
		this.state.queue = new Set(Player.fisherYatesShuffle(this.getQueue()));
	}

	public getCurrentlyPlayingIndex() {
		return this.state.currentlyPlayingIndex;
	}

	public setCurrentlyPlayingIndex(index: number) {
		this.state.currentlyPlayingIndex = index;
	}

	public getCurrentlyPlayingFilePath() {
		return this.getQueue()[this.state.currentlyPlayingIndex];
	}

	public updateCurrentlyPlayingFilePath() {
		this.state.currentlyPlayingFilePath = this.getCurrentlyPlayingFilePath();
	}

	public currentTimeFormatted() {
		return secondsHuman(this.state.inputAudio.currentTime);
	}

	public currentDurationFormatted() {
		return secondsHuman(this.state.inputAudio.duration);
	}
}
