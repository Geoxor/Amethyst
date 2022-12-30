# Building from source
Ci si aspetta che le persone che stanno adottando questo approccio abbiano familiarità con il modo in cui ciò viene fatto (clonazione, costruzione, ecc.)

Questo comando creerà Amethyst per il tuo sistema nella cartella `./release/build`

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️Se sei su Linux, il comando sopra tenterà di compilare per
`AppImage`, `deb`, `rpm` e `snap`, esso molto probabilmente fallirà perché ti mancherà il
dipendenze richieste per costruirli.

**Dovresti fare qualcosa come quanto segue:**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

Maggiori informazioni su impacchettamento manuale argomenti possono essere trovate nella [documentazione di electronic-builder](https://www.electron.build/configuration/linux.html)
