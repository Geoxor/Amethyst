# Building from source
Ожидается, что люди, которые используют этот подход, будут знакомы с тем, как это делается (клонирование, компоновка и т.д.)

Эта команда создаст Amethyst для вашей системы в папке `./release/build`

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ Если вы используете Linux, приведенная выше команда попытается скомпилировать для 
`AppImage`, `deb`, `rpm` и `snap`, скорее всего, это завершится неудачей, поскольку вам будут не хватать
зависимостей, необходимых для их создания.

**Вы должны сделать что-то вроде следующего:**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

Более подробную информацию о аргументах ручной упаковки можно найти в [документации electron-builder](https://www.electron.build/configuration/linux.html)
