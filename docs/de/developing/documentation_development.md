# Dokumentation Entwicklung
Stellen Sie sicher dass Sie die Schritte in [Arbeitsumgebung einrichten](./setting_up_environment.html) bereits abgeschlossen haben, bevor Sie fortfahren

## Entwicklungsserver starten
```sh
$ yarn docs:dev
```

## Bearbeiten
Wenn Sie die Konfigurationen von Vitepress, um mehr Seiten hinzuzufügen, ändern müssen, finden Sie die Datei `./docs/.vitepress/config.ts` und ändern Sie die Dinge entsprechend.

Die englische Markdown-Dateien sind in die Wurzel des `docs`-Ordner organisiert und die Übersetzungen folgen dieselbe Struktur, aber innerhalb eines Locale-Ordners