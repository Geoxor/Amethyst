# Arbeitsumgebung einrichten

## Voraussetzungen
  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) Community Edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(wenn Sie für Android zu entwickeln planen)_

## Zum ersten Mal klonen

Wenn Sie zum ersten Mal klonen, ist es wichtig die Flag `--recurse-submodules` zu verwenden, da Amethyst über Submodules verfügt, die für die Funktionalität erforderlich sind.

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Installieren Sie [Yarn](https://classic.yarnpkg.com/lang/de/docs/install/#windows-stable), falls Sie dies noch nicht haben.
```sh
$ npm i -g yarn
```

Abhängigkeiten installieren
```sh
$ yarn
```

Sobald alles abgeschlossen ist, soll das Repository bereit sein, um daran zu arbeiten.

## Empfehlungen

Für die Entwicklung wird empfohlen [Visual Studio Code](https://code.visualstudio.com/download) zu verwenden, da das Repository über Erweiterungskonfigurationen, die bei der Entwicklung helfen, verfügt