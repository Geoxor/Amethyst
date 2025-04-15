# Nœud de filtrage

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Le nœud de filtrage comprend un [filtre](https://en.wikipedia.org/wiki/Filter_(signal_processing)) bipolaire basique `(12dB/oct)`, prenant en charge plusieurs [types de filtres](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) pris en charge par l'[API Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) avec un [`gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) ajustable, une [`fréquence`](https://en.wikipedia.org/wiki/Frequency) et un facteur de qualité [`Q`](https://en.wikipedia.org/wiki/Q_factor).

Chacun des filtres peut être reproduit et enchaîné en [série](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) pour créer un filtre avec une [pente](https://en.wikipedia.org/wiki/Roll-off) plus raide. Par exemple, pour créer un filtre avec une pente de `48 dB/octave`, vous devez en chaîner 4 ensemble.

## Types de filtre

Les [types de filtre](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) disponibles sont les suivants:

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (stop-bandes)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (cloche)
- `highshelf`
- `lowshelf`
- [`bandpass` (bandes)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (passe-bas)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (passe-haut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Information

⚠️ La valeur de [`Q`](https://en.wikipedia.org/wiki/Q_factor) et/ou le [`gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) peuvent ne pas avoir d'effet avec certains types de filtre, et/ou certains filtres nécessitent une valeur [`Q`](https://en.wikipedia.org/wiki/Q_factor) de `+1` pour fonctionner comme prévu.
