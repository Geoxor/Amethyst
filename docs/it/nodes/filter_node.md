# Filter Node

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Il nodo filtro tiene un [filtro] a due poli molto semplice.(https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12dB/oct)`, esso ha più [tipi di filtro](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) supportato da il [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) con [`Guadagno`] regolabile(https://it.wikipedia.org/wiki/Guadagno_(elettronica)), [`Frequenza`](https://en.wikipedia.org/wiki/Frequency) e [`Q`](https://it.wikipedia.org/wiki/Fattore_di_merito).

Ognuno dei filtri può essere duplicato e concatenato in [serie](https://it.wikipedia.org/wiki/Daisy_chain_(informatica)) per creare un più ripido [rolloff](https://en.wikipedia.org/wiki/Roll-off) filtro. Ad esempio, per creare un classico `48dB/oct` [rolloff](https://en.wikipedia.org/wiki/Roll-off) filtro, devi catena 4 insieme.

## Filter Types

I possibili [tipi di filtro](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) sono le seguenti: 

- [`allpass`](https://it.wikipedia.org/wiki/Filtro_passa_tutto)
- [`notch` (band-stop)](https://it.wikipedia.org/wiki/Filtro_elimina_banda)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://it.wikipedia.org/wiki/Filtro_passa_banda)
- [`highpass` (lowcut)](https://it.wikipedia.org/wiki/Filtro_passa_alto)
- [`lowpass` (highcut)](https://it.wikipedia.org/wiki/Filtro_passa_basso)

### Notice
⚠️ La [`Q`](https://it.wikipedia.org/wiki/Fattore_di_merito) e/o [`Guadagno`](https://it.wikipedia.org/wiki/Guadagno_(elettronica)) potrebbe non avere effetto con certi tipi e/o certi filtri richiedono una [`Q`](https://it.wikipedia.org/wiki/Fattore_di_merito) valore di `+1` per funzionare come previsto.
