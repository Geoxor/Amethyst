class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      // Merge all channels to interleaved float32
      const numChannels = 2;
      const numSamples = input[0].length;
      const interleaved = new Float32Array(numChannels * numSamples);

      for (let i = 0; i < numSamples; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          interleaved[i * numChannels + ch] = input[ch][i];
        }
      }

      this.port.postMessage(interleaved);
    }
    return true;
  }
}

registerProcessor("capture-processor", CaptureProcessor);