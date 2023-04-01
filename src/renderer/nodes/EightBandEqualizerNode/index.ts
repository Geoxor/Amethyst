import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import { ref } from "vue";
import component from "./component.vue";

export class AmethystEightBandEqualizerNode extends AmethystAudioNode {
  // Used to remember the state for onMounted state 
  // for the slider
  // The typecasting is a small hack because this is passed into a reactive object as markRaw()
  public frequencyPercent = ref(100) as unknown as number;
  public MIN_FREQUENCY = 20;
  public MAX_FREQUENCY = 22050;
  public filters: BiquadFilterNode[] = [];

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post,"AmethystEightBandEqualizerNode", component, position);

    for (let i = 0; i < 8; i++) {
      const eq = context.createBiquadFilter();
      eq.type = "peaking";
      eq.frequency.value = 20 * Math.pow(2, i); 
      eq.gain.value = 0;
      eq.Q.value = 1;
      this.filters.push(eq);
    }

    pre.connect(this.filters[0]);

    for (let i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }
    
    this.filters[this.filters.length - 1].connect(post);

  }

  public override reset(){
    this.filters.forEach((filter, i) => {
      filter.type = "peaking";
      filter.frequency.value = 1000 * Math.pow(2, i);
      filter.gain.value = 0;
      filter.Q.value = 1;
    });
  }

  public getFrequency(idx: number) {
    return this.filters[idx].frequency;
  }

  public setFrequency(idx: number, freq: number) {
    return this.getFrequency(idx).value = freq;;
  }

  public calculateFrequencies(canvas: HTMLCanvasElement): Float32Array {
    const frequencies = new Float32Array(canvas.width);
    const nyquist = this.post.context.sampleRate / 2;
    const minLog = 1;
    const maxLog = Math.log10(nyquist);
    for (let x = 0; x < canvas.width; x++) {
      const log = minLog + (x / canvas.width) * (maxLog - minLog);
      const frequency = Math.pow(10, log);
      frequencies[x] = frequency;
    }
    return frequencies;
  }
}
