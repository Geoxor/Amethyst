import type { RemovableRef } from "@vueuse/core";
import { useLocalStorage } from "@vueuse/core";
import type { IAudioMetadata } from "music-metadata";
import { reactive, watch } from "vue";
import type ElectronEventManager from "./electronEventManager";

// Turns seconds from 80 to 1:20
export const secondsHuman = (time: number) => {
	const seconds = Math.floor(time);
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds % 60;
	return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};

export default class Player {
	public state = reactive({
		sound: new Audio(),
		richPresenceTimer: null as null | NodeJS.Timer,
		ctx: new window.AudioContext(),
		source: null as null | MediaElementAudioSourceNode,
		currentlyPlayingMetadata: null as null | IAudioMetadata,
		currentlyPlayingFilePath: "",
		queue: useLocalStorage("queue", []) as RemovableRef<string[]>,
		currentlyPlayingIndex: -1,
		volume: useLocalStorage("volume", 1) as RemovableRef<number>,
		isPlaying: false,
	});

	constructor(public electron: ElectronEventManager) {
		watch(() => this.state.queue.length, () => this.updateCurrentlyPlayingFilePath());
		watch(() => this.state.currentlyPlayingIndex, () => this.updateCurrentlyPlayingFilePath());
		watch(() => this.state.currentlyPlayingFilePath, () => this.loadSoundAndPlay(this.state.currentlyPlayingFilePath));
	}

	loadSoundAndPlay(path: string) {
		this.state.sound && this.pause();
		this.state.sound = new Audio(path);
		this.state.sound.volume = this.state.volume;
		this.play();
		this.state.sound.onended = () => {
			this.next();
		};

		// Pixelated covers
		// invoke<Buffer>("get-cover-pixelized", [path]).then((cover) => {
		//   currentCover.value = `data:image/png;base64,${cover}`;
		// });

		// This is the timer for the current duration ont he UI
		// because for some reason it doesnt wanna update on its own

		// Discord rich presence timer that updates discord every second
		this.state.richPresenceTimer && clearInterval(this.state.richPresenceTimer);
		this.state.richPresenceTimer = setInterval(() => {
			this.state.currentlyPlayingMetadata && this.electron.invoke("update-rich-presence", [
				this.state.currentlyPlayingMetadata.common.albumartist ? `${this.state.currentlyPlayingMetadata.common.albumartist!} - ${this.state.currentlyPlayingMetadata.common.title}` : this.state.currentlyPlayingFilePath.substring(this.state.currentlyPlayingFilePath.lastIndexOf("\\") + 1),
				secondsHuman(this.state.currentlyPlayingMetadata.format.duration!),
				secondsHuman(this.getCurrentTime()),
				this.state.isPlaying.toString(),
			]);
		}, 1000);

		// set the html title to the song name
		document.title = path || "Amethyst";

		this.electron.invoke<IAudioMetadata>("get-metadata", [path]).then(
			(data) => {
				this.state.currentlyPlayingMetadata = data;
			});

		this.state.source = this.state.ctx.createMediaElementSource(this.state.sound);
		this.state.source.connect(this.state.ctx.destination);
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

	spreadArray(array: string[]): string[] {
		return array.reduce((acc, item) => {
			if (Array.isArray(item))
				return acc.concat(this.spreadArray(item));
			else
				return acc.concat(item);
		}, [] as string[]);
	}

	public play() {
		this.state.sound.play();
		this.state.isPlaying = true;
	}

	public pause() {
		this.state.sound.pause();
		this.state.isPlaying = false;
	}

	public next() {
		if ((this.state.currentlyPlayingIndex + 1) < (this.state.queue.length - 1))
		this.state.currentlyPlayingIndex++;
	}

	public previous() {
		if ((this.state.currentlyPlayingIndex - 1) > 0)
		this.state.currentlyPlayingIndex--;
	}

	public setVolume(volume: number) {
		this.state.sound.volume = volume;
		this.state.volume = volume;
	}

	public volumeUp(amount = 0.1) {
		this.setVolume(this.state.sound.volume = Math.min(1, this.state.sound.volume + amount));
	}

	public volumeDown(amount = 0.1) {
		this.setVolume(Math.max(0, this.state.sound.volume - amount));
	}

	public addToQueueAndPlay(file: string) {
		this.state.queue.unshift(file);
		this.state.currentlyPlayingIndex = 0;
	}

	public getQueue() {
		return this.state.queue;
	}

	public setQueue(files: string[]) {
		this.state.queue = this.spreadArray(files);
	}

	public clearQueue() {
		this.state.queue = [];
	}

	public getCurrentTime() {
		return this.state.sound.currentTime;
	}

	public seekForward(step: number) {
		this.state.sound.currentTime += step;
	}

	public seekBackward(step: number) {
		this.state.sound.currentTime -= step;
	}

	public isPlaying() {
		return this.state.isPlaying;
	}

	public shuffle() {
		this.state.queue = Player.fisherYatesShuffle(this.state.queue);
	}

	public getCurrentlyPlayingIndex() {
		return this.state.currentlyPlayingIndex;
	}

	public setCurrentlyPlayingIndex(index: number) {
		this.state.currentlyPlayingIndex = index;
	}

	public getCurrentlyPlayingFilePath() {
		return this.state.queue[this.state.currentlyPlayingIndex];
	}

	public updateCurrentlyPlayingFilePath() {
		this.state.currentlyPlayingFilePath = this.getCurrentlyPlayingFilePath();
	}

	public currentTimeFormatted() {
		return secondsHuman(this.state.sound.currentTime);
	}

	public currentDurationFormatted() {
		return secondsHuman(this.state.sound.duration);
	}
}
