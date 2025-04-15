# Le graphe de nœuds d'Amethyst (.ang)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/ang.png" alt=".ang" width="128"/>

Il s'agit d'un fichier qui enregistre les positions, les connexions et les valeurs des paramètres pour l'ensemble des nœuds au sein d'un graphe de nœuds.

C'est essentiellement un fichier [JSON](https://en.wikipedia.org/wiki/JSON) sérialisé avec une icône élaborée et une extension ; il peut être modifié avec n'importe quel éditeur de texte si vous avez envie de souffrir.

## Graphe de nœuds par défaut
L'exemple ci-dessous montre à quoi ressemble le graphe de nœuds par défaut d'Amethyst lorsqu'il est enregistré dans un fichier :
```json
{
  "version": 1,
  "nodes": [
    {
      "name": "AmethystInputNode",
      "id": "4637aa16-1427-4b2b-b058-f4ad3e7f969d",
      "position": {
        "x": 0,
        "y": 0
      },
      "connections": [
        {
          "id": "454b6dca-999c-455a-96f1-ddbc383034ad",
          "source": "4637aa16-1427-4b2b-b058-f4ad3e7f969d",
          "target": "e85daa03-63fb-45d0-a185-0415d7bb4ec8"
        }
      ]
    },
    {
      "name": "AmethystMasterNode",
      "id": "e85daa03-63fb-45d0-a185-0415d7bb4ec8",
      "position": {
        "x": 300,
        "y": 0
      },
      "connections": [
        {
          "id": "c1b6dd6b-1e19-49e7-ae71-38d12e56fbd9",
          "source": "e85daa03-63fb-45d0-a185-0415d7bb4ec8",
          "target": "f924a1fd-f742-4400-b5cc-ce88e8453c11"
        }
      ]
    },
    {
      "name": "AmethystOutputNode",
      "id": "f924a1fd-f742-4400-b5cc-ce88e8453c11",
      "position": {
        "x": 450,
        "y": 0
      },
      "connections": []
    }
  ]
}
```
