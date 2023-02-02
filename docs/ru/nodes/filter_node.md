# Фильтр узел

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

Фильтр узел содержит очень простой двухполюсный [фильтр](https://en.wikipedia.org/wiki/Filter_(signal_processing))`(12дБ/окт)`, он имеет несколько [типов фильтров](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) поддерживается [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) с регулируемым [`усилением`](https://ru.wikipedia.org/wiki/Коэффициент_передачи)), [`частотой`](https://ru.wikipedia.org/wiki/Частота) и [`добротностью`](https://ru.wikipedia.org/wiki/Добротность).

Каждый из фильтров может быть продублирован и объединен в [серии](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering)) для создания более резкого [rolloff](https://en.wikipedia.org/wiki/Roll-off) фильтра. Например, для создания классического "48 дБ/окт" [rolloff](https://en.wikipedia.org/wiki/Roll-off) фильтра, вам нужно соединить 4 из них вместе.

## Типы фильтров

Возможными [типами фильтров](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) являются следующие: 

- [`allpass`](https://ru.wikipedia.org/wiki/Фазовый_фильтр)
- [`notch` (band-stop)](https://ru.wikipedia.org/wiki/Полосно-заграждающий_фильтр)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://ru.wikipedia.org/wiki/Полосовой_фильтр)
- [`highpass` (lowcut)](https://ru.wikipedia.org/wiki/Фильтр_верхних_частот)
- [`lowpass` (highcut)](https://ru.wikipedia.org/wiki/Фильтр_нижних_частот)

### Замечение
⚠️ [`Добротность`](https://ru.wikipedia.org/wiki/Добротность) и/или [`усиление`](https://ru.wikipedia.org/wiki/Коэффициент_передачи) может не иметь эффекта с фильтрами определенных типов, и/или некоторые фильтры требуют значение [`добротности`](https://ru.wikipedia.org/wiki/Добротность) равное `+1` для получения ожидаемого эффекта.
