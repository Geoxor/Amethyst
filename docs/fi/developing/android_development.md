# Android-sovelluskehitys
Varmista, että olet tehnyt osion [Kehitysympäristön käyttöönotto](./setting_up_environment.md) vaiheet ennen etenemistä

## Valmistelu
1. Sinun täytyy [valmistella virtuaalinen tai fyysinen laite](https://developer.android.com/studio/run/device) [Android Studiossa](https://developer.android.com/studio).

2. Tiedostossa `capacitor.config.ts` sinun tulee päivittää kehityspalvelimen IP-osoite osoittamaan tietokoneesi IP-osoitteeseen
    ```ts
    const devConfig: CapacitorConfig = {
      ...commonConfig,
      server: {
        url: "http://<your ip>:6969", // Viten kehityspalvelimen URL
        cleartext: true,
      },
    };
    ```

## Kehitysympäristön käynnistäminen
1. [Synkronoi Capacitor-ohjelman konfiguraatio](https://capacitorjs.com/docs/v2/cli/sync)
    ```sh
    $ yarn cap sync
    ```

2. Käynnistä Viten käyttöliittymän kehittäjäpalvelin
    ```sh
    $ yarn start:renderer
    ```

3. Käynnistä Android Studio tässä projektissa
    ```sh
    $ yarn cap open android
    ```

4. Käynnistä Emulaattori
   ![](https://cdn.discordapp.com/attachments/667464431562653706/1112532367446376528/image.png)

## Rakennus

Seuraa [näitä ohjeita](https://developer.android.com/studio/run) [.apk-tiedoston](https://en.wikipedia.org/wiki/Apk_(file_format)) luontia varten
