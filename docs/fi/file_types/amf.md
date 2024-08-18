# Amethyst Metadata File (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Tämä tiedosto tallennetaan `Metadata Cache`-kansioon nimellä `%appdata%/amethyst` ja se on [JSON](https://en.wikipedia.org/wiki/JSON)-tiedosto, joka sisältää annetun äänitiedoston metatiedot. Tiedostonimi on aina sama kuin äänitiedoston nimi, jonka metatietoja se sisältää. Jos äänitiedosto nimetään uudelleen, Amethystin on tehtävä uusi versio metatiedoista, mikä voi johtaa kopioihin välimuistissa olevista tiedostoista.

esim. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`

## Uudelleenluonti

Nämä tiedostot luodaan, kun Amethyst analysoi tiedostoa metatietojen saamiseksi. Ne voidaan kirjoittaa uudelleen pakottamalla metatietojen virkistäminen Amethystissä pudotusvalikosta tai pikakuvakkeella `CTRL + ALT + R`.

## Poisto

Kuten aiemmin mainittiin, kaikki metatietovälimuistit tallennetaan `%appdata%/Amethyst/Metadata Cache`-kansioon. Pelkkä tiedostojen poisto kansiossa poistaa välimuistin.
