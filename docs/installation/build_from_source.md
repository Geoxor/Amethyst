# Building from source
People who are taking this approach are expected to be familiar with how this is done (cloning, building, etc.)

This command will build Amethyst for your system in the `./release/build` folder

```sh
git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package
```