# Configurer l'environnement de développement

## Prérequis
  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) Community Edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(si vous envisagez de développer pour Android)_


## Cloner pour la première fois

Lors du premier clonage, il est important d'utiliser l'option `--recurse-submodules`, car Amethyst contient des sous-modules nécessaires pour son bon fonctionnement.

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Installez [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) si vous ne l'avez pas déjà
```sh
$ npm i -g yarn
```

Installez les dépendances
```sh
$ yarn
```

Une fois terminé, le dépôt devrait être prêt à être utilisé.

## Conseils

Il est recommandé d'utiliser [Visual Studio Code](https://code.visualstudio.com/download) pour le développement, car le dépôt inclut des configurations d'extensions pour faciliter le développement.
