# cqlab-sdk-2

cqlab sdk

# Developing with typescript-starter

## Development zen

To start working, run the `watch:build` task using [`npm`](https://docs.npmjs.com/getting-started/what-is-npm) or [`yarn`](https://yarnpkg.com/).

```sh
npm run watch:build
```

In another terminal tab/window, run the `watch:test` task:

```sh
npm run watch:test
```

These watch tasks make development much faster and more interactive. They're particularly helpful for [TDD](https://en.wikipedia.org/wiki/Test-driven_development)/[BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) workflows.

These watch tasks will build and watch the entire project for changes (to both the library source files and test source files). As you develop, you can add tests for new functionality – which will initially fail – before developing the new functionality. Each time you save, any changes will be rebuilt and retested.

<p align="center">
  <!-- PR request: capture the magic of using a test-running watch task for development -->
  <img alt="typescript-starter's watch task" src="https://user-images.githubusercontent.com/904007/37270842-c05f5192-25a6-11e8-83bb-1981ae48e38e.png">
</p>

Since only changed files are rebuilt and retested, this workflow remains fast even for large projects.

### Cloned from starter pack

Typescript-starter: https://github.com/bitjson/typescript-starter
