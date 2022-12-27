# Amethyst Metadata File (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Ten plik jest przechowywany w folderze `Metadata Cache` w `%appdata%/amethyst` i jest to plik typu [JSON](https://en.wikipedia.org/wiki/JSON) zawierający
metadane danego pliku audio, nazwa pliku będzie taka sama jak nazwa pliku audio, dla którego przechowuje metadane
Jeśli plik zmieni nazwę, amethyst będzie musiał ponownie zbuforować metadane, co oznacza, że mogą istnieć kopie zbuforowanych plików.

np. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`


## Rekreacja
Te pliki są generowane, gdy Amethyst analizuje plik pod kątem metadanych. Mogą być nadpisane przez wymuszone odświeżenie metadanych
w Amethyst z rozwijanego menu lub za pomocą skrótu `CTRL + ALT + R`.

## Usuwanie
Jak wspomniano powyżej, wszystkie pliki podręczne metadanych są przechowywane w `%appdata%/amethyst/Metadata Cache`. Po prostu usunięcie plików w tym folderze spowoduje usunięcie pamięci podręcznej.