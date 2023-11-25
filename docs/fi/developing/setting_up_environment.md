# Kehitysympäristön käyttöönotto

## Ennakkovaatimukset
  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) community edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(mikäli aikoo kehittää android-ohjelmaa)_


## Ensimmäinen kloonaus

Ensimmäistä kertaa kloonatessa on tärkeää käyttää `--recurse-submodules`-lippua, sillä Amethystillä on alikansioita, jotka ovat tarpeellisia sen toiminnan kannalta.

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Asenna [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) mikäli sinulla ei sitä vielä ole
```sh
$ npm i -g yarn
```

Asenna pakettiriippuvuudet
```sh
$ yarn
```

Kun tämä on valmis, repositorio on valmis työskentelyyn

## Suositukset

On suositeltavaa käyttää [Visual Studio Codea](https://code.visualstudio.com/download) kehitystyöhön, sillä repositoriolla on laajennuskonfiguraatioita, jotka helpottavat kehitystyötä.
