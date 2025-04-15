# Développement Android
Assurez-vous d'avoir suivi les étapes de la section [Configuration de l'Environnement de Travail](./setting_up_environment.md) avant de passez à la suite.

## Préparation
1. Vous devez [configurer un appareil émulé ou physique](https://developer.android.com/studio/run/device) sur [Android Studio](https://developer.android.com/studio).

2. Dans `capacitor.config.ts` vous devriez mettre à jour l'adresse IP du serveur de développement avec l'adresse IP de votre ordinateur
    ```ts
    const devConfig: CapacitorConfig = {
      ...commonConfig,
      server: {
        url: "http://<your ip>:6969", // vite's dev server url
        cleartext: true,
      },
    };
    ```

## Démarrage de l'environnement de développement
1. [Synchroniser la config de Capacitor](https://capacitorjs.com/docs/v2/cli/sync)
    ```sh
    $ yarn cap sync
    ```

2. Démarrer le serveur Vite (front-end)
    ```sh
    $ yarn start:renderer
    ```

3. Démarrer Android Studio pour ce projet
    ```sh
    $ yarn cap open android
    ```

4. Démarrer l'émulateur
   ![](https://cdn.discordapp.com/attachments/667464431562653706/1112532367446376528/image.png)

## Compilation (Build)

Suivez [ces étapes](https://developer.android.com/studio/run) pour générer un fichier [.apk](https://en.wikipedia.org/wiki/Apk_(file_format)).
