# testey

[![npm (scoped)](https://img.shields.io/npm/v/testey.svg)](https://www.npmjs.com/package/testey)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/chalk@2.4.1.svg)](https://www.npmjs.com/package/testey)

Removes all spaces from a string.

## Install

```
$ npm install testey
```

## Usage

Makes sure your javascipt files have a corresponding test file.

```js
...
"scripts": {
  ...
  "testey": "testey src -fe .test.js -rp /__tests__",
  ...
}
...
```
