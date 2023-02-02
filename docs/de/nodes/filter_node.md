# Filterknoten

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Der Filterknoten enthält einen sehr einfachen zweipöligen [Filter](https://en.wikipedia.org/wiki/Filter_(signal_processing)), er hat mehrere [Filtertypen](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type), die von der [Web-Audio-API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) mit einstellbarer [`Verstärkung`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Frequenz`](https://de.wikipedia.org/wiki/Frequenz) und [`Q`](https://de.wikipedia.org/wiki/G%C3%BCtefaktor) unterstützt werden.

Jeder der Filter kann dupliziert werden und in [Serien](https://de.wikipedia.org/wiki/Daisy_Chain) verbunden werden, um einen steileren [Rolloff](https://en.wikipedia.org/wiki/Roll-off)-Filter zu erzeugen. Um beispielsweise einen klassischen [Rolloff](https://en.wikipedia.org/wiki/Roll-off)-Filter mit 48 dB/Okt. zu erstellen, muss man 4 davon miteinander verbinden.

## Filtertypen

Die möglichen [Filtertypen](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) sind die folgenden: 

- [`Allpass`](https://de.wikipedia.org/wiki/Allpassfilter)
- [`notch` (Bandsperre)](https://de.wikipedia.org/wiki/Bandsperre)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`Bandpass` (Band)](https://de.wikipedia.org/wiki/Bandpass)
- [`Hochpass` (Tiefschnitt)](https://de.wikipedia.org/wiki/Hochpass)
- [`Tiefpass` (Hochschnitt)](https://de.wikipedia.org/wiki/Tiefpass)


### Hinweis
⚠️ Bei bestimmten Typen haben [`Q`](https://de.wikipedia.org/wiki/G%C3%BCtefaktor) und/oder [`Verstärkung`](https://en.wikipedia.org/wiki/Gain_(electronics)) möglicherweise keinen Einfluss, und/oder bestimmte Filter erfordern einen [`Q-Wert`](https://de.wikipedia.org/wiki/G%C3%BCtefaktor) von `+1`, um wie erwartet zu funktionieren.
