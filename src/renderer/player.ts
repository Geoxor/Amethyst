import { useLocalStorage } from "@vueuse/core";
import type { IAudioMetadata } from "music-metadata";
import { reactive, watch } from "vue";
import type ElectronEventManager from "./electronEventManager";
import type AppState from "./state";
import mitt from 'mitt';
import { COVERART_RENDERING_CONCURRENCY } from "./state";
import { AmetyhstNotification } from "./notification";

export const ALLOWED_EXTENSIONS = ["ogg", "flac", "wav", "opus", "aac", "aiff", "mp3", "m4a"];

// Turns seconds from 80 to 1:20
export const secondsHuman = (time: number) => {
	const seconds = ~~time;
	const minutes = ~~(seconds / 60);
	const secondsLeft = seconds % 60;
	return `${minutes || 0}:${secondsLeft < 10 ? "0" : ""}${secondsLeft || 0}`;
};

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

		outputDevices: [] as MediaDeviceInfo[],
		inputDevices: [] as MediaDeviceInfo[],
	});

	constructor(public appState: AppState, public electron: ElectronEventManager) {
		// Ignore the --require arg we get in dev mode so we don't end up with "--require" as a path in the queue
		electron.electron.on<string>("play-file", file => file !== "--require" && this.addToQueueAndPlay(file));
		electron.electron.on<(string)[]>("play-folder", files => this.setQueue(files));
		electron.electron.on<(string)[]>("load-folder", files => this.setQueue([...files, ...this.getQueue()]));

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
			this.state.currentlyPlayingMetadata && this.electron.invoke("update-rich-presence", [
				this.state.currentlyPlayingMetadata.common.artist ? `${this.state.currentlyPlayingMetadata.common.artist || "Unkown Artist"} - ${this.state.currentlyPlayingMetadata.common.title}` : this.state.currentlyPlayingFilePath.substring(this.state.currentlyPlayingFilePath.lastIndexOf("\\") + 1),
				secondsHuman(this.state.currentlyPlayingMetadata.format.duration!),
				secondsHuman(this.getCurrentTime()),
				this.state.isPlaying.toString(),
			]);
		}, 1000);
	}

	private updateCurrentMetadata(path: string) {
		this.electron.invoke<IAudioMetadata>("get-metadata", [path]).then(
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
		this.state.inputAudio.volume = this.state.volume;

		// Create a source out of the context
		this.state.source = this.state.ctx.createMediaElementSource(this.state.inputAudio);

		// Create a destination out of the context
		const destination = this.state.ctx.createMediaStreamDestination();

		this.state.source.connect(destination);

		// Create a new audio element that way we can change the audio output path
		this.state.outputAudio.srcObject = destination.stream;

		// Play the sound and handle playback
		this.play();
		this.state.inputAudio.onended = () => this.next();

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
			if (this.appState.state.coverCache[file]) continue;
			await this.getCoverArt(file);
		}
	}

	public getCoverArt = async (path: string) => {
		this.appState.state.coverCache[path] = await this.electron.invoke<string>("get-cover", [path]);
		return new AmetyhstNotification({
			title: "Cover Art Loaded",
			body: `Cover art for <strong>${path}</strong> has finished rendering`
		})
	};

	public play() {
		this.state.outputAudio.play();
		this.state.inputAudio.play();
		this.state.isPlaying = true;
		this.emit("play", this.state.currentlyPlayingFilePath);
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
		this.state.inputAudio.volume = volume;
		this.state.volume = volume;
		this.emit("setVolume", volume);
	}

	public volumeUp(amount = 0.1) {
		this.setVolume(this.state.inputAudio.volume = Math.min(1, this.state.inputAudio.volume + amount));
	}

	public volumeDown(amount = 0.1) {
		this.setVolume(Math.max(0, this.state.inputAudio.volume - amount));
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
