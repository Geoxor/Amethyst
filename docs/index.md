---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Player
  image:
    src: /icon.svg
    alt: Amethyst logo
  tagline: A powerful node-based audio player written in the Web Platform.
  actions:
    - theme: brand
      text: Download
      link: /installation/package_managers
    - theme: alt
      text: Documentation
      link: /introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Fast and Multithreaded
    details: Amethyst uses GLSL and multithreading under the hood
  - icon: ⚒️
    title: Powerful Node Editor
    details: Create complex audio routings and effects to setup your equipment
  - icon: 💎
    title: Attractive UI
    details: Simple and easy to understand UI inspired by Ableton
  - icon: 🔌
    title: Plugins
    details: Support for plugins to add more features

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