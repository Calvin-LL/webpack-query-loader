# webwork-query-loader
Run loaders depending on query.

If you're trying to use `resourceQuery` in webpack v4 you're in the right place. If you're using [webpack v5](https://github.com/webpack/webpack/issues/10552), consider using the built in `resourceQuery` instead of this loader

This loader is an attempt to solve problems like [this issue](https://github.com/webpack/webpack/issues/3497).

## Install
Install with npm:

```bash
npm install --save-dev webwork-query-loader
```

Install with yarn:

```bash
yarn add webwork-query-loader --dev
```

## Usage
```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /(png|jpe?g|svg)/i,
        rules: [
          {
            loader: "url-loader",
          },
          {
            loader: "webwork-query-loader",
            options: {
              resourceQuery: "external",
              use:{
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
