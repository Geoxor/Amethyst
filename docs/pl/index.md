---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Odtwarzacz Muzyki
  image:
    src: /icon.svg
    alt: Logo Amethyst
  tagline: Potężny, oparty na węzłach odtwarzacz audio napisany na platformie Web.
  actions:
    - theme: brand
      text: Pobierz
      link: /pl/installation/package_managers
    - theme: alt
      text: Dokumentacja
      link: /pl/introduction
    - theme: alt
      text: Zobacz na github
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Szybki i wielowątkowy
    details: Amethyst używa GLSL i wielu wątków
  - icon: ⚒️
    title: Potężny edytor węzłowego routingu
    details: Twórz złożony routing audio i efekty
  - icon: 💎
    title: Atrakcyjny interfejs użytkownika
    details: Prosty i łatwy do zrozumienia UI inspirowany przez Ableton
  - icon: 🔌
    title: Pluginy
    details: Wsparcie dla pluginów, pozwalające dodać więcej funkcji

# Meta property
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Amethyst
  - - meta
    - property: og:image
      content: site_preview.png
  - - meta
    - property: og:url
      content: https://github.com/Geoxor/amethyst
  - - meta
    - name: title
      content: Amethyst
  - - meta
    - name: twitter:card
      content: site_preview.png
  - - link
    - rel: icon
      type: image/svg
      href: icon.svg
---