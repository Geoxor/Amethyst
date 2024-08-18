# Setting up development environment

## Prerequisites

  - [Node.js](https://nodejs.org/en) ^19.1.0
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) ^8.19.0
  - [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/downloads/) community edition
  - [Android Studio](https://developer.android.com/studio) ^2022.1.1 _(if planning on developing for android)_

## Cloning for the first time

When cloning for the first time it's important to use the `--recurse-submodules` flag as Amethyst has submodules that are required for it to work..

```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst
```

Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) if you don't have it alread.

```sh
$ npm i -g yarn
```

Install dependencie.

```sh
$ yarn
```

Once complete the repository should be ready to work on

## Recommendations

It is recommended to use [Visual Studio Code](https://code.visualstudio.com/download) for development as the repository has extension configs to aid with development
