# Vettorscopio

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

A [vettorscopio](https://it.wikipedia.org/wiki/Vettorscopio) è un utile strumento di visualizzazione che traccia l'ampiezza di un [stereo](https://it.wikipedia.org/wiki/Stereofonia) segnale in un [bidimensionale](https://en.wikipedia.org/wiki/2D_computer_graphics) [Grafico X-Y](https://it.wikipedia.org/wiki/Oscilloscopio), con X che è il canale uno in orizzontale e Y che è il canale due in verticale, rivelando così la relazione tra i due segnali ([correlation](#correlation)).

## Simplification
In poche parole, il vettorscopio mostra quanto sia "ampio" o "stereo" il segnale.

## Correlation

[Correlazione](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) è un valore arbitrario che definisce quanto sono 'simili' i due segnali, ovvero un segnale stereo di un segnale identico [sinusoidale](https://it.wikipedia.org/wiki/Onda_sinusoidale)
con sincronizzato [fase](https://it.wikipedia.org/wiki/Fase_(segnali)) risulterebbe in un valore di correlazione di `+1` mentre un segnale con una delle [fasi](https://it.wikipedia.org/wiki/Fase_(segnali)) invertito (180°) risulterebbe in una correlazione di `-1`.

Visivamente possiamo capire cosa ci sta mostrando il vettorscopio capendo che quando le linee sono per lo più verticali abbiamo una correlazione vicino a `+1` rispetto a quando le linee sono orizzontali, il che significa che siamo vicini a `-1`.
