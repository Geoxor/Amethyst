import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";
import { AmethystAudioNodeManager } from "./audio";
import { EventEmitter } from "./eventEmitter";
import { secondsToHuman } from "./formating";
import { Queue } from "./queue";
import { Track } from "./track";

export enum LoopMode {
	None,
	All,
	One,
}

export class Player extends EventEmitter<{
  play: Track;
  pause: Track;
  volume: number;
  stop: void;
}> {
  private currentTrack = ref<Track>();
  private currentTrackIndex = ref(0);

  public isPlaying = ref(false);
  public isStopped = ref(true);
  public isPaused = ref(false);
  public loopMode = ref(LoopMode.None);
  public currentTime = ref(0);
  public volume = useLocalStorage<number>("volume", 1);
  public queue = new Queue();

  public input = new Audio();
  protected context = new window.AudioContext();
  public source = this.context.createMediaElementSource(this.input);

  public nodeManager = new AmethystAudioNodeManager(this.source, this.context);

  public constructor(){
    super();

    this.input.addEventListener("timeupdate", () => this.currentTime.value = this.input.currentTime);
    this.input.onended = this.next;
  }

  public play(idx?: number) {
    if (idx) {
      const track = this.queue.getTrack(idx);
      this.input.src = track.path;
      this.setVolume(this.volume.value);
      this.currentTrack.value = track;
      this.currentTrackIndex.value = idx;
      this.input.play();
    }
    this.input.play();
    this.isPlaying.value = true;
    this.isPaused.value = false;
    this.isStopped.value = false;
    this.emit("play", this.getCurrentTrack()!);
  }

  public pause() {
		this.input.pause();
    this.isPlaying.value = false;
    this.isPaused.value = true;
    this.isStopped.value = false;
    this.emit("pause", this.getCurrentTrack()!);
  }

  public stop(){
		this.input.pause();
    this.isPlaying.value = false;
    this.isPaused.value = false;
    this.isStopped.value = true;
    this.currentTrack.value = undefined;
    this.currentTrackIndex.value = 0;
    this.emit("stop");
  }

  public next(){
    this.currentTrackIndex.value++;
    this.play(this.currentTrackIndex.value);
  }

  public previous(){
    this.currentTrackIndex.value--;
    this.play(this.currentTrackIndex.value);
  }

  public seekTo(time: number) {
		
	}

	public seekForward(step = 5) {
		
	}

	public seekBackward(step = 5) {
		
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

  public setVolume(volume: number) {
		this.volume.value = Math.max(0, Math.min(1, volume));
    this.nodeManager.master.node.gain.value = this.volume.value;
    this.emit("volume", this.volume.value);
	}

	public volumeUp(amount = 0.1) {
		this.setVolume(this.volume.value + amount);
	}

	public volumeDown(amount = 0.1) {
		this.setVolume(this.volume.value - amount);
	}

  public getCurrentTrack(): Track | undefined {
    return this.currentTrack.value;
  }

  public currentTimeFormatted() {
		return secondsToHuman(this.currentTime.value);
	}

	public currentDurationFormatted() {
		return secondsToHuman(this.input.duration);
	}
}