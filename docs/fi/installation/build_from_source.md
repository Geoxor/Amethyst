# Rakentaminen lähteestä
Tätä lähestymistapaa käyttävien henkilöiden odotetaan tuntevan, miten tämä tehdään (kloonaus, rakentaminen jne.).

Tämä komento rakentaa Amethystin järjestelmääsi varten kansioon `./release/build`

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux

⚠️ If you're on Linux the command above will attempt to compile for 
`AppImage`, `deb`, `rpm` and `snap`. It will most likely fail as you're going to be missing the
dependencies required to build them.


**Sinun pitäisi tehdä jotain seuraavanlaista:**

```sh
$ yarn package --linux dir # rakentaa ohjelman "release/build/linux-unpacked" -kansioon
```

```sh
$ yarn package --linux deb # rakentaa asennettavan .deb-paketin
```

```sh
$ yarn package --linux appimage # rakentaa appimagen
```

Tietoa manuaalisesta pakkausargumentoinnista löytyy lisää [electron-builderin dokumentaatiosta](https://www.electron.build/configuration/linux.html)
