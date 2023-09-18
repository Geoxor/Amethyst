# Разработка для Android
Убедитесь, что вы выполнили действия, описанные в разделе [Настройка рабочей среды](./setting_up_environment.md) прежде чем продолжать.

## Подготовка
1. Необходимо [настроить эмулируемое или физическое устройство](https://developer.android.com/studio/run/device) в вашем [Android Studio](https://developer.android.com/studio).

2. В `capacitor.config.ts` вам следует обновить IP адресс dev сервера к IP-адресу вашего компьютера.
    ```ts
    const devConfig: CapacitorConfig = {
      ...commonConfig,
      server: {
        url: "http://<your ip>:6969", // vite's dev server url
        cleartext: true,
      },
    };
    ```

## Запуск среды разработки
1. [Синхронизируйте конфиг capacitor](https://capacitorjs.com/docs/v2/cli/sync)
    ```sh
    $ yarn cap sync
    ```

2. Запустите внешний dev-сервер Vite
    ```sh
    $ yarn start:renderer
    ```

3. Запустите Android Studio с этим проектом
    ```sh
    $ yarn cap open android
    ```

4. Запустите Эмулятор
   ![](https://cdn.discordapp.com/attachments/667464431562653706/1112532367446376528/image.png)

## Сборка

Следуйте [этим шагам](https://developer.android.com/studio/run) чтобы собрать [.apk](https://en.wikipedia.org/wiki/Apk_(file_format))
