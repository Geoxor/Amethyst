# Vectorscope

<img align="right" style="margin-left: 8px;" src="/vectorscope.png" alt=".node" width="128"/>

Ang [vectorscope](https://en.wikipedia.org/wiki/Vectorscope) ay isang useful visualization tool na nagp-plot ng amplitude ng isang [stereo](https://en.wikipedia.org/wiki/Stereophonic_sound) signal sa [two-dimensional](https://en.wikipedia.org/wiki/2D_computer_graphics) [X-Y graph](https://en.wikipedia.org/wiki/Oscilloscope#X-Y_mode), sa pamamagitan ng
X bilang channel one, pahalang, at Y bilang channel two, patayo, na nagpapakita ng isang relationship sa pagitan ng dalawang signals ([correlation](#correlation)).

## Simplification
Sa madaling sabi, ang vectorscope ay nagpapakita kung gaanong "kalawak" o kung paanong "stereo" ang signal.

## Correlation

Ang [Correlation](https://www.beis.de/Elektronik/Correlation/CorrelationCorrectAndWrong.html#:~:text=Audio%20Correlation%20Measurement%20Basics&text=In%20our%20case%20correlation%20means,levels%20may%20be%20completely%20different) ay isang arbitrary value na nagde-define kung paano 'magkatulad' ang dalawang signal, meaning na ang stereo signal ng isang identical [sinewave](https://en.wikipedia.org/wiki/Sine_wave)
na may synchronized [phase](https://en.wikipedia.org/wiki/Phase_(waves)) ay magkakaresulta ng correlation value ng `+1`, samantalang ang signal na may [phases](https://en.wikipedia.org/wiki/Phase_(waves)) na baligtad (180°) ay magkakaresulta ng correlation of `-1`.

Visually, malalaman natin kung ano ang pinapakita ng vectorscope sa pamamagitan ng pag-uunawa natin na kapag ang mga linya ay halos patayo, mayroong correlation malapit sa `+1`, versus kapag ang mga linya ay pahalang, nangangahulugang ito na malapit tayo sa `-1`.
