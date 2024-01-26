# Développement de la documentation
Assurez-vous d'avoir suivi les étapes de la section [Configuration de l'Environnement de Travail](./setting_up_environment.md) avant de passez à la suite.

## Démarrer le serveur de dev
```sh
$ yarn docs:dev
```

## Édition
Si vous avez besoins de changer la configuration de vitepress pour ajouter de nouvelles pages par exemple... allez dans `./docs/.vitepress/config.ts` et changez / ajoutez ce dont vous avez besoin.

Les fichiers Markdown en Anglais sont organisés dans le dossier racine `docs`, et les traductions suivent la même structure, mais à l'intérieur d'un dossier spécifique à la langue.
