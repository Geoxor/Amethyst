# 滤波器节点

<img align="right" style="margin-left: 8px;" src="https://cdn.discordapp.com/attachments/667464431562653706/1052202046369054720/filter_node.png" alt=".node" width="256"/>

节点有一个非常基本的两极[滤波器](https://en.wikipedia.org/wiki/Filter_(signal_processing)) `(12dB/oct)`，它有多种[滤波器类型](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type)，由 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) 支持，可调节的[`电子增益器`](https://en.wikipedia.org/wiki/Gain_(electronic))，[`频率`](https://en.wikipedia.org/wiki/Frequency) 和 [Q 因子](https://en.wikipedia.org/wiki/Q_factor)。

每个滤波器都可以通过[串联](https://en.wikipedia.org/wiki/Daisy_chain_(electrical_engineering))进行复制和连锁，以创造一个更陡峭的[滚降](https://en.wikipedia.org/wiki/Roll-off)滤波器。例如，要创建一个经典的 `48dB/oct` [滚降](https://en.wikipedia.org/wiki/Roll-off)滤波器，你需要把它们中的 4 个串起来。

## 滤波器类型

可用的[滤波器类型](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type)有以下几种：

- [`allpass`](https://en.wikipedia.org/wiki/All-pass_filter)
- [`notch` (band-stop)](https://en.wikipedia.org/wiki/Band-stop_filter)
- `peaking` (bell)
- `highshelf`
- `lowshelf`
- [`bandpass` (band)](https://en.wikipedia.org/wiki/Band-pass_filter)
- [`highpass` (lowcut)](https://en.wikipedia.org/wiki/High-pass_filter)
- [`lowpass` (highcut)](https://en.wikipedia.org/wiki/Low-pass_filter)

### 注意事项
⚠️ [Q 因子](https://en.wikipedia.org/wiki/Q_factor) 和 [`电子增益器`](https://en.wikipedia.org/wiki/Gain_(electronic))可能对某些类型没有影响，某些滤波器要求 [Q 因子](https://en.wikipedia.org/wiki/Q_factor)的值为 `+1`。
