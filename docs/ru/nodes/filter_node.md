# Node фильтр

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Node фильтр содержит очень простой двухполюсный [фильтр](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12дБ/окт)`, он имеет несколько [типов фильтров](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) поддерживается [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) с регулируемым [`усилением`](https://ru.wikipedia.org/wiki/Коэффициент_передачи)), [`частотой`](https://ru.wikipedia.org/wiki/Частота) и [`добротностью`](https://ru.wikipedia.org/wiki/Добротность).

Каждый из фильтров может быть продублирован и соединен в цепочку в [серии](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) для создания более резкого [rolloff](https://en.wikipedia.org/wiki/Roll-off) фильтра. Например, для создания классического "48 дБ/окт" [rolloff](https://en.wikipedia.org/wiki/Roll-off) фильтра, вам нужно соединить 4 из них вместе.

## Типы фильтров

The possible [filter types](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) являются следующие: 

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### Замечение
⚠️ [`Добротность`](https://ru.wikipedia.org/wiki/Добротность) и/или [`усиление`](https://ru.wikipedia.org/wiki/Коэффициент_передачи) может не иметь эффекта с определенными типами, и/или некоторые фильтры требуют от[`добротности`](https://ru.wikipedia.org/wiki/Добротность) значение `+1` для работы, как ожидалось.
