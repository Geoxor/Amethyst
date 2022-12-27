---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Player
  image:
    src: /icon.svg
    alt: Amethyst logo
  tagline: Ein leistungsstarker Node-basierter Audio Player geschrieben in der Web-Plattform.
  actions:
    - theme: brand
      text: Download
      link: /de/installation/package_managers
    - theme: alt
      text: Dokumentation
      link: /de/introduction
    - theme: alt
      text: auf GitHub ansehen
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Schnell und Multithreaded
    details: Amethyst benutzt GLSL und Multithreading unter der Haube
  - icon: ⚒️
    title: Starker Node Editor
    details: Erschaffe komplexe Audio Routings und Effekte um dein Equipment einzurichten
  - icon: 💎
    title: Attraktive UI
    details: Simple und einfach zu verstehende UI inspiriert von Ableton
  - icon: 🔌
    title: Plugins
    details: Support für Plugins um weitere Features hinzuzufügen

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