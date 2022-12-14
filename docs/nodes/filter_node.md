# Filter Node

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

The filter node holds a very basic two pole [filter](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oct)`, it has multiple [filter types](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) supported by the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) with adjustable [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Frequency`](https://en.wikipedia.org/wiki/Frequency) and [`Q`](https://en.wikipedia.org/wiki/Q_factor)

Each of the filters can be duplicated and chained in [series](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) to create a steeper [rolloff](https://en.wikipedia.org/wiki/Roll-off) filter. For example, to create a classic `48dB/oct` [rolloff](https://en.wikipedia.org/wiki/Roll-off) filter, you need to chain 4 of them together.

## Filter Types

The possible [filter types](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) are the following: 

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)


### Notice
⚠️ The [`Q`](https://en.wikipedia.org/wiki/Q_factor) and/or [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) may not have an affect with certain types, and/or certain filters
require a [`Q`](https://en.wikipedia.org/wiki/Q_factor) value of `+1` to work as expected

