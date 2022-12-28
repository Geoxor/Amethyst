# 矢量示波器

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

[矢量示波器](https://en.wikipedia.org/wiki/Vectorscope)是一套强大的[立体声](https://zh.wikipedia.org/zh-cn/%E7%AB%8B%E9%AB%94%E8%81%B2)信号可视化工具，将信号的振幅绘制在[二维](https://zh.wikipedia.org/zh-cn/%E4%BA%8C%E7%BB%B4%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2)的[X-Y坐标图](https://zh.wikipedia.org/zh-cn/%E7%A4%BA%E6%B3%A2%E5%99%A8#X-Y%E6%A8%A1%E5%BC%8F)上。X作为横向通道1，Y作为纵向通道2，这样就能体现出两组信号之间的关联性。([相关性](#相关性)).

## 简述
简单说，矢量示波器能够显示出信号的“长”和“宽”。

## 相关性

[相关性](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different)是一个代表两个信号之间有多“相似”的随意值; 也就是说一个相同的，有着同步[相位](https://zh.wikipedia.org/zh-cn/%E7%9B%B8%E4%BD%8D)的[正弦波](https://zh.wikipedia.org/zh-cn/%E6%AD%A3%E5%BC%A6%E6%9B%B2%E7%B7%9A)播出的立体声信号
  之间的相关性值将会是`+1`; 而在同一个信号中将其中的一个[相位](https://zh.wikipedia.org/zh-cn/%E6%AD%A3%E5%BC%A6%E6%9B%B2%E7%B7%9A)反转(180°)后，其相关性值将为`-1`。

视觉上来说，我们可以将矢量示波器的显示看为，当信号线接近竖直时，相关性值大约为 `+1` ，接近横向时则约为 `-1`。
