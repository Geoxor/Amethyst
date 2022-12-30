# Filter Node

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Węzeł fitra to podstawowy dwubiegunowy [filter](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oct)`, posiada on również wiele [typów filtrów](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) obsługiwanych przez [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) z regulowalnym [`Wzmacniaczem`](https://en.wikipedia.org/wiki/Gain_(electronics)), [`Częstotliwością`](https://en.wikipedia.org/wiki/Frequency) oraz [`Q`](https://en.wikipedia.org/wiki/Q_factor).

Każdy z filtrów może być powielany i łączony w [szereg](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) aby stworzyć bardziej stromy filtr [rolloff](https://en.wikipedia.org/wiki/Roll-off) filter. Na przykład, aby stworzyć klasyczny `48dB/oct` [rolloff](https://en.wikipedia.org/wiki/Roll-off) filtr, musisz połączyć łańcuchowo 4 z nich.

## Filter Types

Możliwe [typy filtrów](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) są następujące:

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Uwaga

⚠️ Wartość [`Q`](https://en.wikipedia.org/wiki/Q_factor) i/lub [`Gain`](https://en.wikipedia.org/wiki/Gain_(electronics)) może nie mieć wpływu z niektórymi typami, i/lub niektóre filtry wymagają wartości [`Q`](https://en.wikipedia.org/wiki/Q_factor) równej `+1` aby działać zgodnie z oczekiwaniami.
