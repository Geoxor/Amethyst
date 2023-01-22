# Vektorskop

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

Ein [Vektorskop](https://de.wikipedia.org/wiki/Vektorskop) ist ein nützliches Werkzeug zur Visualisierung, das die Amplitude eines [stereophonen](https://de.wikipedia.org/wiki/Stereophonie) Signals in einem [zweidimensionalen](https://de.wikipedia.org/wiki/2D-Computergrafik) [X-Y-Diagramm](https://de.wikipedia.org/wiki/Oszilloskop#X-Y-Modus) plottet, wobei X horizontal für Kanal eins und Y vertikal für Kanal zwei ist und somit die Beziehung zwischen den beiden Signalen ([Korrelation](#korrelation)) offenbart.

## Vereinfachung
Einfach ausgedrückt zeigt das Vektorskop, wie "breit" oder "stereophon" das Signal ist.

## Korrelation

[Korrelation](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) ist ein willkürlicher Wert, der beschreibt, wie ähnlich die beiden Signale sind. Ein stereo Signal einer identischen [Sinuswelle](https://de.wikipedia.org/wiki/Sinusfunktion) mit synchronisierten [Phasen](https://en.wikipedia.org/wiki/Phase_(waves)) würde einen Korrelationswert von `+1` ergeben, während ein Signal mit einer der Phasen (180°) invertiert eine Korrelation von `-1` ergibt.

Visuell können wir verstehen, was das Vektorskop uns zeigt, indem wir verstehen, dass die Linien meist vertikal sind, wenn wir eine Korrelation in der Nähe von `+1` haben, im Gegensatz zu horizontalen Linien, die bedeuten, dass wir in der Nähe von `-1` sind.