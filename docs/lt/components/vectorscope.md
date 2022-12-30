# Vectorscope

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

[Vektorskopas](https://en.wikipedia.org/wiki/Vectorscope) yra naudingas vizualizacijos įrankis, kuris išmatuoja [stereo](https://en.wikipedia.org/wiki/Stereophonic_sound) signalo amplitudę [dviejų dimensijų](https://en.wikipedia.org/wiki/2D_computer_graphics) [X-Y grafiku](https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), kai
X yra pirmas kanalas horizontaliai ir Y yra antras kanalas vertikaliai, taip parodant santykį tarp šių dviejų signalų ([koreliacija](#correlation)).

## Simplification
Paprasčiau, vektorskopas parodo, koks "platus" ar "stereo" yra signalas.

## Correlation

[Koreliacija](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) yra reikšmė, kuri apibūdina, kiek panašūs tie du signalai yra, t.y. stereo signalas identiškos [sinusinės bangos](https://en.wikipedia.org/wiki/Sine_wave)
su sinchronizuota [faze](https://en.wikipedia.org/wiki/Phase_(waves)) sukeltų koreliacijos reikšmę `+1`, tuomet signalas su viena iš [fazių](https://en.wikipedia.org/wiki/Phase_(waves)) apvesrta (180°) sukeltų koreliacijos reikšmę `-1`.

Vizualiai mes galime suprasti ką vektorskopas rodo, suprasdami, kad kai linijos yra pagrinde vertikalios, mes turime koreliaciją netoli `+1`, ir kai linijos yra horizontalios, mes esame netoli `-1`.
