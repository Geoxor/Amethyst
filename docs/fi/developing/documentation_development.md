# Dokumentaatiosivujen kehitys
Varmista, että olet tehnyt osion [Kehitysympäristön käyttöönotto](./setting_up_environment.md) vaiheet ennen etenemistä

## Kehityspalvelimen käynnistäminen
```sh
$ yarn docs:dev
```

## Muokkaus
Jos sinun tarvitsee muokata vitepressin konfiguraatiota lisätäksesi sivuja yms, mene tiedostoon `./docs/.vitepress/config.ts` ja muokkaa asioita tarpeen mukaan.

Englanninkieliset markdown-tiedostot ovat `docs`-kansion juuressa, ja käännökset seuraavat samaa rakennetta, mutta oman käännöskansionsa sisällä
