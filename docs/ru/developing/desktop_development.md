# Разработка Amethyst для десктопов

Убедитесь, что вы выполнили действия, описанные в разделе [Настройка рабочей среды](./setting_up_environment.md) прежде чем продолжать.

## Запуск dev-сервера

Amethyst использует [Electron](https://www.electronjs.org/) для десктопного клиента, для начала разработки сделайте следующее

```sh
$ yarn dev
```

## Сборка

Файлы сборки всегда будут находиться в папке `./release/build`.

### Windows

```sh
$ yarn package
```

### Linux

::: warning

Если вы работаете в Linux, то `yarn package` попытается скомпилировать
`AppImage`, `deb`, `rpm` и `nap`. Скорее всего, это не удастся, так как будут отсутствовать
зависимостей, необходимых для их сборки.

:::

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

Более подробную информацию о аргументах для ручной упаковки можно найти в [документации electron-builder](https://www.electron.build/configuration/linux.html)

## Сброс изменений в репозитории

Я создал простой скрипт для быстрого удаления `node_modules` и всех изменений, внесенных в репозиторий, с помощью следующей команды:

```sh
$ yarn clean
```
