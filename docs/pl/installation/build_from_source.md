# Budowanie z źródła
Od osób, które stosują takie podejście oczekuje się, że będą wiedziały jak to się robi (klonowanie, budowanie itp.).

To polecenie zbuduje Amethyst dla twojego systemu w folderze `./release/build`.

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ Jeśli korzystasz z linuxa, powyższa komenda będzie próbowała skompilować dla 
`AppImage`, `deb`, `rpm` i `snap`, najprawdopodobniej nie powiedzie się, ponieważ będzie brakować
zależności wymaganych do ich zbudowania.

**W takim wypadku trzeba zrobić coś w stylu:**

```sh
$ yarn package --linux dir # buduje się w "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # buduje się do pakietu deb
```

```sh
$ yarn package --linux appimage # buduje się do pakietu appimage
```

Więcej informacji o argumentach w ramach pakowania ręcznego można znaleźć w [dokumentacji electron-builder](https://www.electron.build/configuration/linux.html)
