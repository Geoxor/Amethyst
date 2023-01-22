# Erstellen aus Quellcode
Es wird erwartet, dass Personen, die diesen Ansatz verfolgen, mit dem Erstellen aus Quellcode vertraut sind (clonen, bauen, usw.)

Dieser Befehl baut Amethyst für Ihr System im Ordner "./release/build"

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ Wenn Sie unter Linux sind, wird der oben genannte Befehl versuchen, für
`AppImage`, `deb`, `rpm` und `snap` zu kompilieren. Es wird wahrscheinlich fehlschlagen, da die
Abhängigkeiten, die zum Erstellen erforderlich sind, fehlen.

**Sie sollten etwas wie das Folgende tun:**
```sh
$ yarn package --linux dir # Erstellt in "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # Erstellt ein deb-Paket
```

```sh
$ yarn package --linux appimage # Erstellt ein AppImage
```

Weitere Informationen zu manuellen Packaging-Argumenten finden Sie in der [electron-builder Dokumentation](https://www.electron.build/configuration/linux.html)

