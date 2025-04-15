---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Player
  image:
    src: /icon.svg
    alt: Amethyst logo
  tagline: Un lecteur audio performant basé sur des nœuds, développé sur la Web Platform.
  actions:
    - theme: brand
      text: Télécharger
      link: /installation/package_managers
    - theme: alt
      text: Documentation
      link: /introduction
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Rapide et multi-threadé.
    details: Amethyst utilise GLSL et le multithreading
  - icon: ⚒️
    title: Un puissant éditeur de nœud
    details: Créez des routes audio complexes et appliquez des effets pour configurer votre équipement
  - icon: 💎
    title: Un design moderne
    details: Une interface utilisateur simple et facile à comprendre, inspirée par Ableton
  - icon: 🔌
    title: Plugins
    details: Prise en charge de plugins pour ajouter des fonctionnalités supplémentaires

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