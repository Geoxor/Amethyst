# Vectorscope

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

A [vectorscope](https://en.wikipedia.org/wiki/Vectorscope) is a useful visualization tool that plots the amplitude of a [stereo](https://en.wikipedia.org/wiki/Stereophonic_sound) signal in a [two-dimensional](https://en.wikipedia.org/wiki/2D_computer_graphics) [X-Y graph](https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), with
X being channel one horizontally and Y being channel two vertically, thus revealing the relationship between the two signals ([correlation](#correlation)).

## Simplification
Simply put, the vectorscope shows how "wide" or "stereo" the signal is.

## Correlation

[Correlation](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) is an arbitrary value that defines how 'similar' the two signals are, meaning a stereo signal of an identical [sinewave](https://en.wikipedia.org/wiki/Sine_wave)
with synchronized [phase](https://en.wikipedia.org/wiki/Phase_(waves)) would result in a correlation value of `+1` whereas a signal with one of the [phases](https://en.wikipedia.org/wiki/Phase_(waves)) inverted (180°) would result in a correlation of `-1`.

Visually we can understand what the vectorscope is showing us by understanding that when the lines are mostly vertical we have a correlation near `+1` versus when the lines are horizontal which means we are near `-1`.
