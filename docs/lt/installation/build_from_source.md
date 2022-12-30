# Kompiliavimas iš pirminio kodo
Vartotojai, kurie rinksis šį pasirinkimą, turi būti susipažinę, kaip tai vyksta (klonavimas, kompiliavimas, t.t.)

Ši komanda sukompiliuos Amethyst `./release/build` aplanke

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ Jei naudojate Linux, komanda viršuje bandys kompiliuoti 
`AppImage`, `deb`, `rpm` ir `snap`. Jai tikriausiai nepavyks, nes trūks reikalingų paketų

**Jūs turėtumėte daryti tai:**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

Daugiau informacijos apie rankinius pakavimo argumentus galima rasti [electron-builder dokumentacijoje](https://www.electron.build/configuration/linux.html)
