# Construire de la sursă
Pentru cei care aleg aceasta abordare, se presupune că aceștia sunt familiarizați cu modul în care se face acest lucru (clonarea, construirea, etc.)

Această comandă va construi Amethyst pentru sistemul dvs. în folderul `./release/build`

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ Dacă utilizați Linux, comanda de mai sus va încerca să compileze pentru
`AppImage`, `deb`, `rpm` și `snap`. Cel mai probabil, aceasta va eșua deoarece nu veți avea dependențele necesare pentru construire.

**Ar trebui să faceți ceva in stilul următor:**

```sh
$ yarn package --linux dir # construieste în "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # construieste într-un pachet deb
```

```sh
$ yarn package --linux appimage # construieste într-un appimage
```

Mai multe informații despre argumentele de packaging manual pot fi găsite în [documentația electron-builder](https://www.electron.build/configuration/linux.html)
