# Amethyst Metadatendatei (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Diese Datei wird im Ordner `Metadata Cache` innerhalb von `%appdata%/amethyst` gespeichert und ist eine [JSON](https://de.wikipedia.org/wiki/JavaScript_Object_Notation)-Datei, die die Metadaten der gegebenen Audiodatei enthält. Der Dateiname ist der gleiche wie der Name der Audiodatei, für die er Metadaten speichert. Wenn die Datei umbenannt wird, muss Amethyst die Metadaten erneut cachen, was bedeutet, dass es Kopien von gecachten Dateien geben kann.

z.B. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`

## Erneuerung
Diese Dateien werden erstellt, wenn Amethyst eine Datei auf Metadaten analysiert. Sie können durch erzwingen des Aktualisierens der Metadaten innerhalb von Amethyst aus dem Dropdown-Menü oder mit dem Tastenkürzel `STRG + ALT + R` neu geschrieben werden.

## Löschung
Wie oben erwähnt, werden alle Metadaten-Caches in `%appdata%/amethyst/Metadata Cache` gespeichert. Durch einfaches Löschen der Dateien innerhalb des Ordners kann der Cache gelöscht werden.