# Настройка рабочей среды

## Пререквизиты
  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) community edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(если вы планируете разработку для Android)_


## Клонирование в первый раз

При первом клонировании важно использовать флаг `--recurse-submodules`, поскольку в Amethyst есть подмодули, необходимые для его работы.

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Установите [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) если у вас его ещё нет.
```sh
$ npm i -g yarn
```

Установите зависимости.
```sh
$ yarn
```

После выполнения репозиторий должен быть готов к работе.

## Рекомендации

  Рекомендуем использовать [Visual Studio Code](https://code.visualstudio.com/download) для разработки так как в репозитории имеются конфигурации расширений для помощи в разработке.
