# Homestuck Online

A very barebones Homestuck reader, that uses Ruffle to play the original swfs. The first steps in an attempt to basically entirely port [Bambosh's offline unofficial Homestuck collection](https://bambosh.dev/unofficial-homestuck-collection/) to an online version.

Makin claims this should use GPL because it uses code from Bambosh's UHC but I checked and it actually doesn't. So I made it use MIT instead.

## Project Setup

```sh
npm install / yarn install
```

### Compile and Hot-Reload for Development

```sh
npm run dev / yarn dev
```

### Compile and Minify for Production

```sh
npm run build / yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit / yarn test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint / yarn lint
```
