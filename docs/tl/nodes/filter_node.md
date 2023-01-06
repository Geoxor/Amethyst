# Filter Node

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Ang filter node ay humahawak ng isang basic two pole [filter](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oct)`, mayroon rin itong maraming [filter types](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) na isinusuporta ng [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) na may adjustable [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Frequency`](https://en.wikipedia.org/wiki/Frequency) at [`Q`](https://en.wikipedia.org/wiki/Q_factor).

Ang mga filters na ito ay maaring i-doble at i-chain sa [series](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) para makagawa ng steeper [rolloff](https://en.wikipedia.org/wiki/Roll-off) filter. Isang halimbawa nito, para makagawa ng classic `48dB/oct` [rolloff](https://en.wikipedia.org/wiki/Roll-off) filter, kailangan mong i-chain ang 4 na mga filter nang magkasama.

## Filter Types

Ang mga posibleng [filter types](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) ay ang mga sumusunod: 

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Notice
⚠️ Ang [`Q`](https://en.wikipedia.org/wiki/Q_factor) at/o [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) ay maaaring walang epekto sa mga iilang types, at/o ang mga certain filters ay kinakailangan ng [`Q`](https://en.wikipedia.org/wiki/Q_factor) value of `+1` para gumana gaya ng inaasahan.
