# Przygotowywanie środowiska deweloperskiego

## Wymagania

  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) community edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(jeśli planujesz budować wersję na android)_

## Klonowanie po raz pierwszy

Podczas klonowania, ważne jest aby skorzystać z flagi `--recurse-submodules` ponieważ Amethyst ma submoduł który jest wymagany do prawidłowego działania.

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Zainstaluj [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) Jeżeli jeszcze tego nie zrobiłeś

```sh
$ npm i -g yarn
```

Zainstaluj zależności

```sh
$ yarn
```

Po poprawnym wykonaniu tej komendy, repozytorium powinno być gotowe.

## Zalecenia

Zaleca się korzystanie z [Visual Studio Code](https://code.visualstudio.com/download) ponieważ repozytorium zawiera konfiguracje rozszerzeń, które pomagają w rozwoju aplikacji
