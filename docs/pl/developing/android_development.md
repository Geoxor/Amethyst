# Rozwój wersji android aplikacji

Upewnij się że wykonałeś wszystkie kroki opisane w [Przygotowywanie środowiska deweloperskiego](./setting_up_environment.html)

## Przygotowania

1. Potrzebujesz [ustawić emulowane lub fizyczne urządzenie](https://developer.android.com/studio/run/device) w [Android Studio](https://developer.android.com/studio).

2. W `capacitor.config.ts` powinieneś zaktualizować adres IP serwera dev na adres komputera
    ```ts
    const devConfig: CapacitorConfig = {
      ...commonConfig,
      server: {
        url: "http://<your ip>:1337", // adres serwera
        cleartext: true,
      },
    };
    ```

## Uruchamianie środowiska dev

1. [Zsynchronizuj konfigurację capacitor](https://capacitorjs.com/docs/v2/cli/sync)

    ```sh
    $ yarn cap sync
    ```

2. Uruchom serwer dev front-endu

    ```sh
    $ yarn start:renderer
    ```

3. Uruchom android studio

    ```sh
    $ yarn cap open android
    ```

4. Uruchom emulator

   ![](https://cdn.discordapp.com/attachments/667464431562653706/1112532367446376528/image.png)

## Budowanie

Wykonaj [te kroki](https://developer.android.com/studio/run) aby zbudować do pliku [.apk](https://en.wikipedia.org/wiki/Apk_(file_format))