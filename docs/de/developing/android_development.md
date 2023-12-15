# Android-Entwicklung
Stellen Sie sicher dass Sie die Schritte in [Arbeitsumgebung einrichten](./setting_up_environment.html) bereits abgeschlossen haben, bevor Sie fortfahren

## Vorbereitung
1. Sie müssen ein [emuliertes oder physisches Gerät](https://developer.android.com/studio/run/device) auf [Android Studio](https://developer.android.com/studio) einrichten.

2. In `capacitor.config.ts` müssen Sie die IP-Adresse des Entwicklungsservers zu der IP-Adresse Ihres Computers ändern.
    ```ts
    const devConfig: CapacitorConfig = {
      ...commonConfig,
      server: {
        url: "http://<ihre IP>:6969", // URL der Vite-Entwicklungsserver
        cleartext: true,
      },
    };
    ```

## Entwicklungsumgebung starten
1. [Capacitor-Konfiguration synchronisieren](https://capacitorjs.com/docs/v2/cli/sync)
    ```sh
    $ yarn cap sync
    ```

2. Vite Frontend-Entwicklungsserver starten
    ```sh
    $ yarn start:renderer
    ```

3. Android Studio für dieses Projekt starten
    ```sh
    $ yarn cap open android
    ```

4. Emulator starten
    ![](https://cdn.discordapp.com/attachments/667464431562653706/1112532367446376528/image.png)

## Erstellen

Folgen Sie [diesen Schritten](https://developer.android.com/studio/run), um ein [.apk](https://en.wikipedia.org/wiki/Apk_(file_format))-Datei zu erstellen
