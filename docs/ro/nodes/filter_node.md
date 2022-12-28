# Nodul filtru

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Nodul filtru conține un simplu [filtru](https://en.wikipedia.org/wiki/Filter_(signal_processing)) bipolar `(12dB/oct)`, acesta are multiple [tipuri de filtre](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) suportate de [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) cu [`Amplificare`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Frecvență`](https://en.wikipedia.org/wiki/Frequency) și [`Q`](https://en.wikipedia.org/wiki/Q_factor) ajustabile.

Fiecare dintre aceste filtre pot fi duplicate și conectate în [serie](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) pentru a crea un filtru cu [rolloff](https://en.wikipedia.org/wiki/Roll-off) mai pronunțat. De exemplu, pentru a crea un filtru cu rolloff de `48dB/oct` trebuie să conectați 4 filtre.

## Tipuri de filtre

[Tipurile de filtre](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) posibile sunt următoarele:

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Notă
⚠️ [`Q`](https://en.wikipedia.org/wiki/Q_factor) și/sau [`Amplificare`](https://en.wikipedia.org/wiki/Gain_(electronics)) nu au un efect asupra unor tipuri de filtre, iar unele filtre necesită o valoare de [`Q`](https://en.wikipedia.org/wiki/Q_factor) de `+1` pentru a funcționa corect.
