# File di metadati Amethyst (Amethyst Metadata File (.amf))

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Questo file è memorizzato nella cartella `Metadata Cache` all'interno di `%appdata%/amethyst` ed è un file [JSON](https://it.wikipedia.org/wiki/JavaScript_Object_Notation) contenente
il i metadati del dato file audio, il nome del file sarà lo stesso del nome del file audio memorizza i metadati per
Se il file viene rinominato, amethyst dovrà rimemorizzare i metadati nella cache, il che significa che potrebbero esserci copie dei file memorizzati nella cache.

per esempio. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`


## Rigenerazione
Questi file vengono generati quando Ametista analizza un file per i metadati. Possono essere riscritti aggiornando forzatamente i metadati
all'interno di Ametista dal menu a discesa o con la scorciatoia `CTRL + ALT + R`.

## Cancellazione
Come accennato in precedenza, tutte le cache dei metadati sono archiviate in `%appdata%/amethyst/Metadata Cache`. La semplice eliminazione dei file all'interno della cartella consentirà di eliminare la cache.
