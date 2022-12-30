# Amethyst Metadata File (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

Ang file na ito ay naka-store sa `Metadata Cache` folder sa loob ng `%appdata%/amethyst` at ito ay isang [JSON](https://en.wikipedia.org/wiki/JSON) file na naglalaman ng 
metadata ng ibinigay na audio file. Ang filename ay magiging kapareho ng pangalan ng audio file na iniimbak ng metadata nito.
Kung ang file ay napalitan ng pangalan, kailangang muling ire-cache ng Amethyst ang metadata. Ibig sabihin ay maaaring may mga kopya ang mga naka-cache na file.

hal. `enjoii - Never Say Goodbye.flac` => `enjoii - Never Say Goodbye.flac.amf`


## Regeneration
Nabubuo ang mga file na ito kapag sinusuri ng Amethyst ang isang file para sa metadata. Maaari silang muling isulat sa pamamagitan ng pagre-refresh ng metadata
sa loob ng Amethyst mula sa dropdown menu o gamit ang shortcut `CTRL + ALT + R`.

## Deletion
Gaya ng nabanggit sa itaas, lahat ng metadata cache ay naka-store sa `%appdata%/amethyst/Metadata Cache`. Ang simpleng pagtanggal lang ng mga files sa loob ng folder ay makakatanggal ng cache.
