import "./analytics";

import { secondsToColinHuman, secondsToHuman } from "@shared/formating.js";
import { useLocalStorage } from "@vueuse/core";
import { ref, watch } from "vue";

import type { Amethyst } from "@/amethyst.js";
import { AmethystAudioNodeManager } from "@/logic/audioManager.js";
import { EventEmitter } from "@/logic/eventEmitter.js";
import type { PossibleSortingMethods} from "@/logic/queue.js";
import { Queue } from "@/logic/queue.js";
import { Track } from "@/logic/track.js";

export enum LoopMode {
	None,
	All,
	One,
}

export interface PlayerEvents {
  "player:currentTrackMetadataLoaded": Track;
  "player:seek": number;
  "player:play": Track;
  "player:resume": Track;
  "player:pause": Track;
  "player:stop": void;
  "player:volumeChange": number;
  "player:next": Track;
  "player:previous": Track;
  "player:trackChange": Track;
}

export class Player extends EventEmitter<PlayerEvents> {
  private minVolume: number = 0.001;
  private maxVolume: number = 1.0;
  public minDb: number = -48;
  public maxDb: number = 0;
  private volumeStored = useLocalStorage<number>("volume", 1, { writeDefaults: true });

  private currentTrack = ref<Track>();
  private currentTrackIndex = ref(0);
  public pitchSemitones = useLocalStorage<number>("pitchSemitones", 0);
  public isPlaying = ref(false);
  public isStopped = ref(true);
  public isPaused = ref(false);

  public loopMode = ref(LoopMode.None);
  public currentTime = ref(0);
  public queue = new Queue(this.amethyst);

  public input = new Audio();
  public context = new AudioContext({latencyHint: "interactive", sampleRate: this.amethyst.state.settings.audio.resampleRate });
  public source = this.context.createMediaElementSource(this.input);
  public nodeManager: AmethystAudioNodeManager;

  public constructor(private amethyst: Amethyst) {
    super();

    // Set multichannel support
    this.context.destination.channelCount = this.context.destination.maxChannelCount;

    this.input.addEventListener("timeupdate", () => this.currentTime.value = this.input.currentTime);
    this.input.onended = () => this.next();

    this.nodeManager = new AmethystAudioNodeManager(this.source, this.context, this.amethyst);
    
    // Set the volume on first load
    console.log(this.volumeStored.value);
    
    this.nodeManager.master.post.gain.value = this.volumeStored.value;

    watch(() => this.pitchSemitones.value, newPitch => {this.setPlaybackSpeed(newPitch);});

    amethyst.IS_DEV && this.showEventLogs();
  }

  private showEventLogs() {
    this.on("player:play", () => console.log("%cplayer:play", "color: #ff00b6"));
    this.on("player:pause", () => console.log("%cplayer:pause", "color: #ff00b6"));
    this.on("player:resume", () => console.log("%cplayer:resume", "color: #ff00b6"));
    this.on("player:stop", () => console.log("%cplayer:stop", "color: #ff00b6"));
    this.on("player:volumeChange", () => console.log("%cplayer:volumeChange", "color: #ff00b6"));
    this.on("player:next", () => console.log("%cplayer:next", "color: #ff00b6"));
    this.on("player:previous", () => console.log("%cplayer:previous", "color: #ff00b6"));
    this.on("player:trackChange", () => console.log("%cplayer:trackChange", "color: #ff00b6"));
    this.on("player:seek", () => console.log("%cplayer:seek", "color: #ff00b6"));
  }

  public playRandomTrack = () => {
    this.amethyst.player.play(this.amethyst.player.queue.getList()[~~(Math.random() * this.amethyst.player.queue.getList().length)]);
  };

  public setPlaybackSpeed(semitones: number) {
    function semitonesToPlaybackRate(semitones: number) {
      return Math.pow(2, semitones / 12);
    }

    this.input.playbackRate = semitonesToPlaybackRate(semitones);
  }

  private async setPlayingTrack(track: Track) {
    this.input.src = ["mac", "linux"].includes(this.amethyst.getCurrentOperatingSystem()) ? `file://${track.path}` : track.path;
    this.input.preservesPitch = false;
    this.setPlaybackSpeed(this.pitchSemitones.value);
    this.currentTrack.value = track;
    this.currentTrackIndex.value = this.queue.getList().indexOf(track);
    this.input.play();
    this.isPlaying.value = true;
    this.isPaused.value = false;
    this.isStopped.value = false;
    this.emit("player:trackChange", this.getCurrentTrack()!);

    if (!track.isLoaded) {
      await track.fetchAsyncData();
      this.emit("player:currentTrackMetadataLoaded", track);
    }
  }
  
  public getBufferSize() {
    return ~~(this.context.baseLatency * this.context.sampleRate);
  }

  public async getLatency(){
    return this.context.baseLatency * 1000;
  }

  /**
   * Changes the currenlty playing tune to the given input and plays it
   * @param target the index or instace of a Track
   */
  public play(target?: number | Track) {
    if (target !== undefined) {
      const track = target instanceof Track ? target : this.queue.getTrack(target);
      if (track.hasErrored) return;
      this.setPlayingTrack(track);
      return;
    }
    // Play the first track by default
    if (!this.currentTrack.value) {
      // Find the first non-errored track
      const track = this.queue.getList().find(track => !track.hasErrored);
      track && this.setPlayingTrack(track);
      return;
    }
    this.input.play();
    this.isPlaying.value = true;
    this.isPaused.value = false;
    this.isStopped.value = false;
    this.emit("player:resume", this.getCurrentTrack()!);
  }

  public pause() {
		this.input.pause();
    this.isPlaying.value = false;
    this.isPaused.value = true;
    this.isStopped.value = false;
    this.emit("player:pause", this.getCurrentTrack()!);
  }

  public stop(){
		this.input.pause();
    this.isPlaying.value = false;
    this.isPaused.value = false;
    this.isStopped.value = true;
    this.currentTrack.value = undefined;
    this.currentTrackIndex.value = 0;
    this.emit("player:stop");
  }

  public shuffle() {
    this.queue.shuffle();
  }

  /*
  * Should be called when a track ended
  */
  public next() {
    if (this.loopMode.value === LoopMode.One) {
      this.play(this.currentTrackIndex.value);
      return;
    }

    this.skip();
  }

  /*
  * Should be called when the user skips a track
  */
  public skip() {
    const filterText = useLocalStorage("filterText", "");
    const currentShortMethod = useLocalStorage<PossibleSortingMethods>("currentShortMethod", "default");

    let startOfQueue = 0;

    const searchResults = this.queue.getListSorted(currentShortMethod.value, filterText.value);
    startOfQueue = this.queue.getList().indexOf(searchResults[0]);
    const nextInSearch = searchResults[searchResults.indexOf(this.getCurrentTrack()!) + 1];
    this.currentTrackIndex.value = this.queue.getList().indexOf(nextInSearch);

    // Check if we reached the end of the queue
    if (!this.queue.getTrack(this.currentTrackIndex.value)) {
      this.currentTrackIndex.value = startOfQueue;

      // If we don't loop: go to the start of the queue and pause the player
      if (this.loopMode.value === LoopMode.None) {
        const track = this.queue.getTrack(this.currentTrackIndex.value);

        this.input.src = track.path;
        this.currentTrack.value = track;
        this.seekTo(0);
        if (!track.isLoaded) {
          track.fetchAsyncData();
        }
        this.pause();
        return;
      }
    }

    this.play(this.currentTrackIndex.value);

    // For event
    const newTrack = this.getCurrentTrack();
    newTrack && this.getCurrentTrack() && this.emit("player:next", newTrack);
  }

  public previous() {
    const filterText = useLocalStorage("filterText", "");
    const currentShortMethod = useLocalStorage<PossibleSortingMethods>("currentShortMethod", "default");

    let endofQueue = 0;

    const searchResults = this.queue.getListSorted(currentShortMethod.value, filterText.value);
    endofQueue = this.queue.getList().indexOf(searchResults[searchResults.length - 1]);
    const previousInSearch = searchResults[searchResults.indexOf(this.getCurrentTrack()!) - 1];
    this.currentTrackIndex.value = this.queue.getList().indexOf(previousInSearch);

    if (this.currentTrackIndex.value < 0) {
      this.currentTrackIndex.value = endofQueue;
    }

    this.play(this.currentTrackIndex.value);

    // For event
    const newTrack = this.getCurrentTrack();
    newTrack && this.getCurrentTrack() && this.emit("player:previous", newTrack);
  }

  public seekTo(time: number) {
		this.input.currentTime = time;
    this.emit("player:seek", this.input.currentTime);
	}

	public seekForward(step = 5) {
		this.seekTo(this.currentTime.value + step);
	}

	public seekBackward(step = 5) {
		this.seekTo(this.currentTime.value - step);
	}

  public loopNone() {
		this.loopMode.value = LoopMode.None;
	};

	public loopOne() {
		this.loopMode.value = LoopMode.One;
	};

	public loopAll() {
		this.loopMode.value = LoopMode.All;
	};

  public get volume(): number {
    const clampedVolume = Math.max(this.minVolume, Math.min(this.maxVolume, this.volumeStored.value));
    const dB = 20 * Math.log10(clampedVolume);
    return Math.max(this.minDb, dB); // Clamp for safety
  }

  public set volume(dB: number) {
    const clampedDb = Math.max(this.minDb, Math.min(this.maxDb, dB));
    const linear = Math.pow(10, clampedDb / 20);
    this.volumeStored.value = dB <= this.minDb ? 0 : linear; // completely mute at -60
  }

  public setVolume(dB: number) {
    this.volume = dB;
    const linear = this.volumeStored.value;
    this.nodeManager.master.post.gain.value = linear;
    this.emit("player:volumeChange", dB);
  }

	public volumeUp(dB = 1) {
		this.setVolume(this.volume + dB);
	}

	public volumeDown(dB = 1) {
		this.setVolume(this.volume - dB);
	}

  public getCurrentTrack(): Track | undefined {
    return this.currentTrack.value;
  }

  public currentTimeFormatted(colinNotation?: boolean) {
		return colinNotation ? secondsToColinHuman(this.currentTime.value) : secondsToHuman(this.currentTime.value);
	}
}
