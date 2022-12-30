---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Player
  image:
    src: /icon.svg
    alt: Amethyst logo
  tagline: Isang malakas na node-based audio player na nakasulat sa Web Platform.
  actions:
    - theme: brand
      text: I-download
      link: /ph/installation/package_managers
    - theme: alt
      text: Dokumentasyon
      link: /ph/introduction
    - theme: alt
      text: Makikita sa GitHub
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Mabilis at Multithreaded
    details: Ang Amethyst ay gumagamit ng GLSL at multithreading under the hood
  - icon: ⚒️
    title: Malakas na Node Editor
    details: Gumawa ng kumplikadong audio routings at effects para i-set up ang iyong kagamitan
  - icon: 💎
    title: Attractive UI
    details: Simple at madaling mauunawaang UI inspired by Ableton
  - icon: 🔌
    title: Plugins
    details: Suporta para sa mga Plugins upang makadagdag ng mga maraming features

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