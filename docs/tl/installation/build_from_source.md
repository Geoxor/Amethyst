# Building from source
Sa mga taong tumatanggap ng mga ganitong klaseng approach ay somewhat expected na maging familiar sa kung paano ito iginagawa (cloning, building, etc.)

Ang command na ito ay bubuo ng Amethyst para sa iyong system sa folder na `./release/build`

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ kung nasa Linux ka, ang command sa itaas ay mag-aattempt na mag-compile para sa 
`AppImage`, `deb`, `rpm` at `snap`, Maaring magkamali ang command sa itaas sapagkat mami-miss mo ang
dependencies na required to build them.

**Maari mong gawin ang katulad ng halimbawa sa ibaba:**

```sh
$ yarn package --linux dir # builds into "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # builds into a deb package
```

```sh
$ yarn package --linux appimage # builds into an appimage
```

Ang mga impormasyon tungkol sa manual packaging arguments ay maaring maihanap sa [electron-builder documentation](https://www.electron.build/configuration/linux.html)
