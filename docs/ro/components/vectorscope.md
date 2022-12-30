# Vectorscop

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

Un [vectorscop](https://en.wikipedia.org/wiki/Vectorscope) este o unealtă utilă pentru vizualizare care trasează amplitudinea unui semnal [stereo](https://en.wikipedia.org/wiki/Stereophonic_sound) pe un grafic [bi-dimensional](https://en.wikipedia.org/wiki/2D_computer_graphics) [X-Y](https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), unde X este canalul 1 orizontal și Y este canalul 2 vertical, astfel arătând relația dintre cele două semnale ([corelație](#corelație)).

## Simplificare
În termeni simpli, vectorscopul arată cât de "lat" sau "stereo" este semnalul.

## Corelație

[Correlația](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) este o valoare arbitrară care definește cât de 'similare' sunt două semnale, ceea ce ar înseamna ca un semnal stereo cu o pereche de [sinusoide](https://en.wikipedia.org/wiki/Sine_wave) identice cu [fazele](https://en.wikipedia.org/wiki/Phase_(waves)) sincronizate ar rezulta într-o valoare de corelație de `+1`, unde daca una din [faze](https://en.wikipedia.org/wiki/Phase_(waves)) ar fi inversată (180°) ar rezulta într-o corelație de `-1`.

Vizual putem înțelege ce ne arată vectorscopul prin înțelegerea faptului că atunci când liniile sunt în mare verticale avem o corelație aproape de `+1`,iar când liniile sunt orizontale înseamnă că suntem aproape de `-1`.