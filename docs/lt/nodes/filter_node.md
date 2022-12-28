# Filtrų mazgas

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Filtravimo mazgas turi labai paprastą dviejų polių [filtrą](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oct)`. Jis turi daugelį [filtro tipų](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type), palaikomų [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) su reguliuojamu [`Stiprinimu`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Dažniu`](https://en.wikipedia.org/wiki/Frequency) ir [`Q`](https://en.wikipedia.org/wiki/Q_factor).

Kiekvienas filtras gali būti dublikuotas ir sujungtas [serijomis](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)), kad sukurti statesnį [rolloff](https://en.wikipedia.org/wiki/Roll-off) filtrą. Pavyzdžiui, kad sukurti `48dB/oct` [rolloff](https://en.wikipedia.org/wiki/Roll-off) filtrą, reikia sujungti 4 juos kartu.

## Filtrų tipai

Galimi [filtrų tipai](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) yra: 

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Notice
⚠️ [`Q`](https://en.wikipedia.org/wiki/Q_factor) ir/ar [`Stiprinimas`](https://en.wikipedia.org/wiki/Gain_(electronics)) gali neturėti efekto su kai kuriais tipais ir/ar kai kurie filtrai reikalauja [`Q`](https://en.wikipedia.org/wiki/Q_factor) reikšmės `+1`, kad veiktų tinkamai.
