---
layout: home

# Hero section
hero:
  name: Amethyst
  text: Player
  image:
    src: /icon.svg
    alt: Amethyst logo
  tagline: Tehokas node-pohjainen äänisoitin, joka on toteutettu Web Platformia käyttäen.
  actions:
    - theme: brand
      text: Lataa
      link: /installation/package_managers
    - theme: alt
      text: Dokumentaatio
      link: /introduction
    - theme: alt
      text: Näytä GitHubissa
      link: https://github.com/Geoxor/Amethyst

# Features section
features:
  - icon: 🐇
    title: Nopea ja Monisäikeinen
    details: Amethyst käyttää GLSL:ää ja monisäikeistystä taustajärjestelmässään
  - icon: ⚒️
    title: Tehokas Node-editori
    details: Luo monimutkaisia äänireitityksiä ja efektejä laitteiston asetusten määrittämiseksi
  - icon: 💎
    title: Viehättävä käyttöliittymä
    details: Abletonista inspiroitunut yksinkertainen ja helppokäyttöinen käyttöliittymä
  - icon: 🔌
    title: Lisäosat
    details: Lisäosatuki lisäominaisuuksia varten

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