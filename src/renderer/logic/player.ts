import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export enum LoopMode {
	None,
	All,
	One,
}

export class Player {
  public isPlaying = ref(false);
  public isStopped = ref(true);
  public isPaused = ref(false);
  public volume = useLocalStorage<number>("volume", 1);

  public loopMode = ref(LoopMode.None);

  public play() {
    this.isPlaying.value = true;
    this.isPaused.value = false;
    this.isStopped.value = false;
  }

  public pause() {
    this.isPlaying.value = false;
    this.isPaused.value = true;
    this.isStopped.value = false;
  }

  public stop(){
    this.isPlaying.value = false;
    this.isPaused.value = false;
    this.isStopped.value = true;
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
	}

	public volumeUp(amount = 0.1) {
		this.setVolume(this.volume.value + amount);
	}

	public volumeDown(amount = 0.1) {
		this.setVolume(this.volume.value - amount);
	}
}