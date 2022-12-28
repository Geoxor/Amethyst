# Vectorscope

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

[Vectorscope](https://en.wikipedia.org/wiki/Vectorscope) jest użytecznym narzędziem wizualizacji, które przeplata amplitudę sygnału [stereo](https://en.wikipedia.org/wiki/Stereophonic_sound) w [dwu-wymiarowy](https://en.wikipedia.org/wiki/2D_computer_graphics) [wykres X-Y](https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), w którym
kanał X jest poziomy a Y jest kanałem pionowym, ujawniając w ten sposób związe między tymi dwoma sygnałami ([korelacja](#correlation)).

## Uproszczenie

Mówiąc najprościej, vectorscope pokazuje jak "szeroki" lub "stereofoniczny" jest sygnał.

## Korelacja

[Korelacja](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) jest arbitralną wartością, która określa jak "podobne" są dwa sygnały, co oznacza, że sygnał stereo o identycznej [sinusoidzie](https://en.wikipedia.org/wiki/Sine_wave)
z synchronizowaną [fazą](https://en.wikipedia.org/wiki/Phase_(waves)) spowodowałaby wartość korelacji `+1`, natomiast sygnał z jedną z [faz](https://en.wikipedia.org/wiki/Phase_(waves)) odwróconą (180°) spowodowałby wartość korelacji `-1`.

Wizualnie możemy zrozumieć, co pokazuje nam vectorscope, wiedząc, że gdy linie są w większości pionowe, mamy korelację bliską `+1` w porównaniu z sytuacją, gdy linie są poziome, co oznacza, że jesteśmy blisko `-1`.
