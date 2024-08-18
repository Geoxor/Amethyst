# Rozwój wersji komputerowej aplikacji

Upewnij się że wykonałeś wszystkie kroki opisane w [Przygotowywanie środowiska deweloperskiego](./setting_up_environment.html)

## Uruchamianie serwera dev

Amethyst korzysta z [Electrona](https://www.electronjs.org/) w aplikacji komputerowej, aby uruchomić serwer dev:

```sh
$ yarn dev
```

## Budowanie

Zbudowane pliki bedą zawsze w folderze `./release/build`

### Windows

```sh
$ yarn package
```

### Linux

::: UWAGA
Jeśli korzystasz z linuxa, powyższa komenda będzie próbowała skompilować dla  `AppImage`, `deb`, `rpm` i `snap`, najprawdopodobniej nie powiedzie się, ponieważ będzie brakować zależności wymaganych do ich zbudowania.
:::

**W takim wypadku powinieneś zrobić coś w stylu:**

```sh
$ yarn package --linux dir # buduje do"release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # busduje pakied deb
```

```sh
$ yarn package --linux appimage # buduje appimage
```

Więcej informacji o argumentach w ramach manualnego pakowania można znaleźć w [dokumentacji electron-builder](https://www.electron.build/configuration/linux.html)

## Resetowanie zmian repozytorium

Zrobiłem prosty skrypt aby usunąć `node_modules` i zmiany wykonane w repozytorium za pomocą następującej komendy.

```sh
$ yarn clean
```
