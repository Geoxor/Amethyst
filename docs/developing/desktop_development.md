# Developing Amethyst Desktop

Make sure you have completed the steps in [Setting up Work Environment](./setting_up_environment.md) before preceding

## Starting dev server

Amethyst uses [Electron](https://www.electronjs.org/) for the desktop client, to begin developing do the following

```sh
$ yarn dev
```

## Building

Build files will always be within the `./release/build` folder

### Windows

```sh
$ yarn package
```

### Linux

::: warning
If you're on Linux the `yarn package` will attempt to compile for
`AppImage`, `deb`, `rpm` and `snap`. It will most likely fail as you're going to be missing the
dependencies required to build them.
:::

**You should do something like the following:**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

More information about manual packaging arguments can be found in the [electron-builder documentation](https://www.electron.build/configuration/linux.html)

## Resetting repository changes

I have made a simple script to quickly remove `node_modules` and any changes done in the repo with the following command

```sh
$ yarn clean
```
