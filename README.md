# nest-fastify-trpc-vite-vue

- server framework: [NestJS](https://nestjs.com/)
- server type checker: [TypeScript](https://www.typescriptlang.org/)
- middleware framework: [Fastify](https://www.fastify.io/)
- remote procedure call (RPC) framework: [tRPC](https://trpc.io/)
- client framework: [Vue 3](https://vuejs.org/)
- client build tool: [Vite](https://vite.dev/)
- client type checker: [Vue TypeScript](https://github.com/vuejs/language-tools)
- client testing framework: [Vitest](https://vitest.dev/)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

## Compile and run the project

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
# all tests
pnpm run test

# unit tests
pnpm test:unit

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```
