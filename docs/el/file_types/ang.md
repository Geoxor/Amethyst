# Amethyst Node Graph (.ang)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/ang.png" alt=".ang" width="128"/>

This is a file that stores the positions, connections, and parameter 
values for all nodes within a Node Graph.

It's realistically a serialized [JSON](https://en.wikipedia.org/wiki/JSON) file with a fancy icon and extension,
it can be edited with any text editor if you fancy suffering.

## Default Node Graph
The example below is what Amethyst's default Node Graph looks like if saved into a file:
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
