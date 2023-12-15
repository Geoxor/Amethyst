# Amethyst Desktop entwickeln
Stellen Sie sicher dass Sie die Schritte in [Arbeitsumgebung einrichten](./setting_up_environment.html) bereits abgeschlossen haben, bevor Sie fortfahren

## Entwicklungsserver starten
Für Desktop-Clients verwendet Amethyst [Electron](https://www.electronjs.org/). Um mit der Entwicklung anzufangen, müssen sie folgendes tun:

```sh
$ yarn dev
```

## Erstellen
Build-Dateien befinden sich immer innerhalb des `./release/build`-Ordner

### Windows
```sh
$ yarn package
```

### Linux

::: warning
Wenn Sie unter Linux sind, wird `yarn package` versuchen, die Pakete 
`AppImage`, `deb`, `rpm` und `snap` zu kompilieren. Es wird wahrscheinlich fehlschlagen, da die
Abhängigkeiten, die zum Erstellen erforderlich sind, fehlen.
:::


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

## Änderungen im Repository zurücksetzen
Ich habe ein einfaches Skript zum schnellen Löschen der `node_modules` und alle im Repository vorgenommenen Änderungen mit dem folgenden Befehl erstellt

```sh
$ yarn clean
```
