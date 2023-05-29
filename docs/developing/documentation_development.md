# Documentation Development
Make sure you have completed the steps in [Setting up Work Environment](./setting_up_environment.html) before preceding

## Starting dev server
```sh
$ yarn docs:dev
```

## Editing
If you need to change vitepress's configuration to add more pages etc, find the `./docs/.vitepress/config.ts` and change stuff appropriately.

The english markdown files are organised in the root `docs` folder, and translations follow the same structure but within a locale folder