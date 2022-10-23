export class AmethystEffect {
  constructor(public context: AudioContext) {

  }
}

export class Filter extends AmethystEffect {
  public node: BiquadFilterNode;

  constructor(public context: AudioContext) {
    super(context);
    this.node = this.context.createBiquadFilter();
  }

}