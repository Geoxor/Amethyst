# Suodatinsolmu

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Suodatinsolmu pitää sisällään hyvin perustason kaksinapaisen [suodattimen](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oktaavi)`, joka tukee useita [suodatintyyppejä](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) [Web Audio API:ssa](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Suodattimessa on säädettävät [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Frequency`](https://en.wikipedia.org/wiki/Frequency) ja [`Q`](https://en.wikipedia.org/wiki/Q_factor) -parametrit.

Jokainen suodatin voidaan kopioida ja ketjuttaa [sarjaan](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)), jolloin luodaan jyrkempi [vaimennussuodatin](https://en.wikipedia.org/wiki/Roll-off). Esimerkiksi klassisen `48dB/oktaavi` [vaimennussuodattimen](https://en.wikipedia.org/wiki/Roll-off) luomiseksi sinun tulee ketjuttaa niitä sarjaan yhteensä 4 kappaletta.

## Suodatintyypit

Mahdolliset [suodatintyypit](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) ovat seuraavat: 

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Huomio
⚠️ [`Q`](https://en.wikipedia.org/wiki/Q_factor) ja/tai [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) eivät välttämättä vaikuta tietyntyyppisiin suodattimiin, ja/tai tietyt suodattimet vaativat [`Q`](https://en.wikipedia.org/wiki/Q_factor) -arvon `+1` toimiakseen odotetusti.
