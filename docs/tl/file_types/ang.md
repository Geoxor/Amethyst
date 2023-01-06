# Amethyst Node Graph (.ang)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/ang.png" alt=".ang" width="128"/>

Ito ay isang file na nags-store ng mga positions, connections, at parameter values para sa lahat ng mga nodes within a Node Graph.

Ito ay parang isang serialized [JSON](https://en.wikipedia.org/wiki/JSON) file na may magarbong icon at extension. Maaari itong i-edit gamit ang anumang text editor kung gusto mong magdusa :>.

## Default Node Graph
Ang halimbawa sa ibaba ay kung ano ang hitsura ng default Node Graph ng Amethyst kung naka-save sa isang file:
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
