# Työpöytäsovelluksen kehitys
Varmista, että olet tehnyt osion [Kehitysympäristön käyttöönotto](./setting_up_environment.md) vaiheet ennen etenemistä

## Kehityspalvelimen käynnistäminen
Amethyst käyttää [Electron-rajapintaa](https://www.electronjs.org/). Aloittaaksesi kehittämisen, suorita seuraava komento

```sh
$ yarn dev
```

## Rakennus 
Rakennustideostot löytyvät aina kansiosta `./release/build`

### Windows
```sh
$ yarn package
```

### Linux

::: warning
Mikäli käytät Linuxia, `yarn package` yrittää rakentaa paketit
`AppImage`, `deb`, `rpm` ja `snap`. Tämä tulee mitä ilmeisimmin epäonnistumaan, koska järjestelmästäsi puuttuu tarvittavat kirjastot pakettien kasaamista varten.
:::


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


## Repositorion muutosten palauttaminen
Olen luonut yksinkertaisen skriptin, jolla voit nopeasti poistaa `node_modules` -kansion ja kaikki repoon tehdyt muutokset seuraavalla komennolla:

```sh
$ yarn clean
```
