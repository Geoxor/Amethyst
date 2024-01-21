# Fichier Metadata Amethyst (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Ce fichier est stocké dans le dossier `Metadata Cache` à l'intérieur de `%appdata%/amethyst`, et c'est un fichier [JSON](https://en.wikipedia.org/wiki/JSON) contenant les métadonnées du fichier audio donné. Le nom du fichier sera identique au nom du fichier audio pour lequel il stocke les métadonnées. Si le fichier est renommé, Amethyst devra remettre en cache les nouvelles métadonnées, ce qui signifie qu'il peut y avoir des copies de fichiers mis en cache.

Exemple : `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`


## Regénération
Ces fichiers sont créés lorsqu'Amethyst analyse un fichier pour en extraire les métadonnées. Ils peuvent être réécrits en actualisant de force les métadonnées depuis le menu déroulant d'Amethyst ou en utilisant le raccourci `CTRL + ALT + R`.

## Suppression
Comme mentionné précédemment, toutes les métadonnées en cache sont stockées `%appdata%/Amethyst/Metadata Cache`. Supprimer simplement les fichiers à l'intérieur du dossier permettra de vider le cache.
