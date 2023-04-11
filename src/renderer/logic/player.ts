import { Queue } from "@/logic/queue";
import { Track } from "@/logic/track";
import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";
import { AmethystAudioNodeManager } from "./audioManager";
import { EventEmitter } from "./eventEmitter";
import { secondsToColinHuman, secondsToHuman } from "@shared/formating";

export enum LoopMode {
	None,
	All,
	One,
}

export class Player extends EventEmitter<{
  play: Track;
  pause: Track;
  volume: number;
  shuffleToggle: void;
  stop: void;
  timeupdate: number;
}> {
  private currentTrack = ref<Track>();
  
  private currentTrackIndex = computed<number>(() => {
    return this.queue.curList.value.indexOf(this.currentTrack.value!);
  });

  public isPlaying = ref(false);
  public isStopped = ref(true);
  public isPaused = ref(false);
  public loopMode = ref(LoopMode.None);
  public currentTime = ref(0);
  public volume = useLocalStorage<number>("volume", 1);
  public queue = new Queue();

  public input = new Audio();
  protected context = new AudioContext({latencyHint: "interactive"});
  public source = this.context.createMediaElementSource(this.input);
  public nodeManager: AmethystAudioNodeManager;

  public constructor(){
    super();

    // Set multichannel support
    this.context.destination.channelCount = this.context.destination.maxChannelCount;

    this.input.addEventListener("timeupdate", () => this.currentTime.value = this.input.currentTime);
    this.input.onended = () => this.next();

    this.nodeManager = new AmethystAudioNodeManager(this.source, this.context);
    
    // Set the volume on first load
    this.nodeManager.master.post.gain.value = this.volume.value;
  }

  private setPlayingTrack(track: Track) {
    this.input.src = track.path;
    this.currentTrack.value = track;
    this.input.play();
    if (!track.isLoaded) {
      track.fetchAsyncData();
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
  public play(target: number | Track | undefined) {
    if (target !== undefined) {
      const track = target instanceof Track ? target : this.queue.curList.value[target];
      if (track.hasErrored) return;
      this.setPlayingTrack(track);
    }
    // Play the first track by default
    if (!this.currentTrack.value) {
      // Find the first non-errored track
      const track = this.queue.curList.value.find(track => !track.hasErrored);
      track && this.setPlayingTrack(track);
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

  public stop() {
		this.input.pause();
    this.isPlaying.value = false;
    this.isPaused.value = false;
    this.isStopped.value = true;
    this.currentTrack.value = undefined;
    this.emit("stop");
  }

  public shuffleToggle() {
    this.queue.shuffleToggle();
    this.emit("shuffleToggle");
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
    console.log("Current track index: ", this.currentTrackIndex.value);
    const curList = this.queue.curList.value;
    const nextTrack: Track = curList[this.currentTrackIndex.value + 1];
    console.log("Next track: ", nextTrack);

    // Check if we reached the end of the queue
    if (nextTrack === undefined) {
      // If we don't loop: go to the start of the queue and pause the player
      if (this.loopMode.value === LoopMode.None) {
        console.log("Stopping player");
        this.stop();
      }
      // If we loop: go to the start of the queue and play the first track
      else if (this.loopMode.value === LoopMode.All) {
        this.play(this.getFirstTrack());
      }
    } else {
      this.play(nextTrack);
    }
  }

  public previous() {
    let newIndex = this.currentTrackIndex.value - 1;

    if (newIndex < 0) {
      newIndex = this.queue.curList.value.length - 1;
    }

    this.play(newIndex);
  }

  private getFirstTrack() {
    return this.queue.curList.value[0];
  }

  public seekTo(time: number) {
		this.input.currentTime = time;

    this.emit("timeupdate", this.input.currentTime);
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

  public setVolume(volume: number) {
		this.volume.value = Math.max(0, Math.min(1, volume));
    this.nodeManager.master.post.gain.value = this.volume.value;
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

  public currentTimeFormatted(colinNotation?: boolean) {
		return colinNotation ? secondsToColinHuman(this.currentTime.value) : secondsToHuman(this.currentTime.value);
	}
}

export const player = new Player();