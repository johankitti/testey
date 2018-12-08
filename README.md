# testey

[![npm (scoped)](https://img.shields.io/npm/v/testey.svg)](https://www.npmjs.com/package/testey)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/chalk@2.4.1.svg)](https://www.npmjs.com/package/testey)

Makes sure your javascipt files have a corresponding test files.

## Install

```
$ npm install testey
```

## Usage

```js
...
"scripts": {
  ...
  "testey": "testey src -fe .test.js -rp /__tests__",
  ...
}
...
```

## CLI options

```
[USAGE]
    testey [PATHS] [FLAGS]

[OPTIONS]
    -c      Check, will exit with error if file missing corresponding test
    -fe     File ending
    -rp     Relative path to test file
```
