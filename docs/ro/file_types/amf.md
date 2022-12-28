# Fișier metadata Amethyst (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Acest fișier este salvat în folderul `Metadata Cache` aflat în `%appdata%/amethyst` și este un fișier de tip [JSON](https://en.wikipedia.org/wiki/JSON) care conține metadatele fișierului audio, unde numele fișierului va fi același cu numele fișierului audio pentru care se stochează metadatele
Dacă fișierul este redenumit, amethyst va trebui să re-cacheze metadatele, ceea ce înseamnă că pot exista copii ale fișierelor cache.

eg. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`


## Regenerare
Aceste fișiere sunt generate atunci când Amethyst analizează un fișier pentru metadate. Ele pot fi rescrise prin reîmprospătarea forțată a metadatelor în Amethyst din meniul dropdown sau cu scurtătura `CTRL + ALT + R`.

## Ștergere
Așa cum este menționat mai sus, toate cache-urile de metadate sunt stocate în `%appdata%/Amethyst/Metadata Cache`. Prin ștergerea fișierelor din folder va realiza ștergerea cache-ului.
