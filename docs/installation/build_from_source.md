# ⚒️ Building from source
If you're on this page that probably means you know what you're doing

This command will build Amethyst for your system in the `./release/build` folder

```sh
git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package
```