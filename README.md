# webpack-query-loader [![npm](https://img.shields.io/npm/v/webpack-query-loader)](https://www.npmjs.com/package/webpack-query-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

Run loaders depending on the query.

If you're trying to use `resourceQuery` in webpack v4 you're in the right place. If you're using [webpack v5](https://github.com/webpack/webpack/issues/10552), consider using the built in `resourceQuery` instead of this loader

This loader is an attempt to solve problems like [this issue](https://github.com/webpack/webpack/issues/3497).

## Install

Install with npm:

```bash
npm install --save-dev webpack-query-loader
```

Install with yarn:

```bash
yarn add webpack-query-loader --dev
```

## Usage

```javascript
import png from "./some_pic.png?inline";
```

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /(png|jpe?g|svg)/i,
        rules: [
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "inline",
              use: {
                loader: "url-loader",
              }
            },
          },
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "!inline",
              use: {
                loader: "file-loader",
              }
            },
          },
        ],
      },
    ],
  },
};

```

## Options

|                 Name                  |              Type              |  Default  |                     Description                      |
| :-----------------------------------: | :----------------------------: | :-------: | :--------------------------------------------------: |
|           **[`use`](#use)**           |       `{string\|object}`       | undefined |                  The loader to use                   |
| **[`resourceQuery`](#resourceQuery)** | `{string\|string[]\|function}` | undefined | The conditions that must match for the loader to run |

### `use`

The `use` option can be in one of these formats

```
use: "loader-name"
```

or

```
use: {
  loader: "loader-name",
  options: {
    someOption: true,
  }
}
```

or

```
use: {
  loader: "loader-name"
}
```

### `resourceQuery`

The `resourceQuery` option can be in one of these formats

```
resourceQuery: "run-me" // only run the loader in `use` if the import has query `?run-me`
```

or

```
resourceQuery: "!run-me" // only run the loader in `use` if the import DOES NOT have the query `?run-me`
```

or

```
resourceQuery: ["run-me", "!dont-run-me"] // only run the loader in `use` if the import has query `?run-me` AND no query `!dont-run-me`. For example "./some_pic.png?run-me" would work but "./some_pic.png?run-me&dont-run-me" would not.
```

or

```
// resource is the whole import string e.g "./some_pic.png?run-me"
// resourceQuery is the whole query string e.g "?run-me"
// query is an object of the broken down query string e.g "{ run-me: null }"
// returns true to run the loader, false to skip
(resource, resourceQuery, query) => {
  ...
  return true;
}
```
