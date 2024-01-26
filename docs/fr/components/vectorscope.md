# Vecteurscope

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

Un [vecteurscope](https://en.wikipedia.org/wiki/Vectorscope) est un outil de visualisation qui représente graphiquement l'amplitude d'un signal [stéréo](https://fr.wikipedia.org/wiki/Son_st%C3%A9r%C3%A9ophonique) dans un graphique [bidimensionnel](https://en.wikipedia.org/wiki/2D_computer_graphics) [X-Y] (https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), où X représente le premier canal horizontalement et Y le deuxième canal verticalement, révélant ainsi la relation entre les deux signaux ([corrélation](#corrélation)).

## Simplification
Plus simplement, le vecteurscope montre à quel point le signal est "large" ou "stéréo".

## Corrélation

La [corrélation](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) est une valeur arbitraire qui indique à quel point les deux signaux sont "similaires", ce qui signifie qu'un signal stéréo composé d'un ensemble identique d'[ondes sinusoïdales](https://fr.wikipedia.org/wiki/Signal_sinuso%C3%AFdal) avec des [phases](https://fr.wikipedia.org/wiki/Phase_(onde)) synchronisées donnerait une valeur de corrélation de `+1`, tandis qu'un signal avec l'une des [phases](https://fr.wikipedia.org/wiki/Phase_(onde)) inversée (180°) donnerait une corrélation de `-1`.

On peut visuellement interpréter ce que le vecteurscope nous montre en comprenant que lorsque les lignes sont principalement verticales, nous avons une corrélation proche de `+1`, tandis que lorsque les lignes sont horizontales, cela signifie que nous sommes proches de `-1`.