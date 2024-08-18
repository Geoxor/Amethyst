# Développement d'Amethyst sur ordinateur

Assurez-vous d'avoir suivi les étapes de la section [Configuration de l'Environnement de Travail](./setting_up_environment.md) avant de passez à la suite.

## Démarrer le serveur de dev

Amethyst utilise [Electron](https://www.electronjs.org/) pour le client sur ordinateur. Pour commencer à développer, faites ce qui suit :

```sh
$ yarn dev
```

## Compilation (Build)

Les fichiers compilés seront toujours dans le répertoire `./release/build`

### Windows

```sh
$ yarn package
```

### Linux

::: warning
Si vous êtes sur Linux, `yarn package` va essayer de compiler pour
`AppImage`, `deb`, `rpm` et `snap`.
Il est très probable que cela échoue, car il vous manquera les dépendances nécessaires pour les compiler.
:::

**Vous devriez faire quelquechose comme ça :**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

Vous trouverez davantage d'informations sur les arguments de packaging manuel dans la [documentation d'electron-builder](https://www.electron.build/configuration/linux.html)

## Réinitialisation des modifications du repo

J'ai réalisé un script simple pour rapidement supprimer `node_modules` et toutes les autres modifications faites dans le repo. Il suffit de faire cette commande :

```sh
$ yarn clean
```
