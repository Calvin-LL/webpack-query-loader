# webpack-query-loader

[![npm](https://img.shields.io/npm/v/webpack-query-loader?style=flat)](https://www.npmjs.com/package/webpack-query-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

Run loaders depending on the query string.

If you're trying to use `resourceQuery` in webpack v4 but it doesn't work as documented, you're in the right place. If you're using [webpack v5](https://github.com/webpack/webpack/issues/10552), use the built in `resourceQuery` instead of this loader

This loader is an attempt to solve problems like [this issue](https://github.com/webpack/webpack/issues/3497).

## Install

Install with npm:

```bash
npm install webpack-query-loader --save-dev
```

Install with yarn:

```bash
yarn add webpack-query-loader --dev
```

## Usage

All query parameters (i.e. `?value=2`) will also be passed down to the loader in `use.loader`.

```javascript
import png from "./some_pic.png?inline";
```

#### webpack.config.js

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)/i,
        use: [
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

|                 Name                  |             Type             |  Default  |                     Description                      |
| :-----------------------------------: | :--------------------------: | :-------: | :--------------------------------------------------: |
|           **[`use`](#use)**           |       `string\|object`       | undefined |                  The loader to use                   |
| **[`resourceQuery`](#resourcequery)** | `string\|string[]\|function` | undefined | The conditions that must match for the loader to run |

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
resourceQuery: "run-me" // only run the loader in `use` if the import has query parameter `run-me`
```

or

```
resourceQuery: "!run-me" // only run the loader in `use` if the import DOES NOT have query parameter `run-me`
```

or

```
resourceQuery: ["run-me", "!dont-run-me"] // only run the loader in `use` if the import has query parameter `run-me` AND no query parameter `dont-run-me`. For example "./some_pic.png?run-me" would work but "./some_pic.png?run-me&dont-run-me" would not.
```

or

```
// resource is the whole import string e.g "./some_pic.png?run-me"
// resourceQuery is the whole query string e.g "?run-me"
// query is an object of the broken down query string e.g "{ run-me: null }"
// query is empty (e.g. `{}`) if no query string exist in the import statement
// returns true to run the loader, false to skip
(resource, resourceQuery, query) => {
  ...
  return true;
}
```

#### Notes:

For example, this query string `?height=10&width=10&resize` has query parameters `height`, `width`, and `resize`

An import statement without a query string is considered not to have any query parameter
