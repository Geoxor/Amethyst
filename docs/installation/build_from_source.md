# Building from source
People who are taking this approach are expected to be familiar with how this is done (cloning, building, etc.)

This command will build Amethyst for your system in the `./release/build` folder

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ If you're on Linux this will attempt to compile for 
`AppImage`, `deb`, `rpm` and `snap`, therefore you should do something like this


```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

More information about manual packaging arguments can be found in the [electron-builder documentation](https://www.electron.build/configuration/linux.html)

