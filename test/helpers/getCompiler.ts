import path from "path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";
import webpack5 from "webpack5";

export default (
  webpackVersion: 4 | 5,
  loaderOptions?: any,
  useUrlLoader = false,
  filename = "simple.js"
) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, filename),
    output: {
      publicPath: "",
      path: path.resolve(__dirname, "..", "/outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg)/i,
          use: [
            ...(useUrlLoader
              ? [
                  {
                    loader: "url-loader",
                  },
                ]
              : []),
            {
              loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
              options: loaderOptions,
            },
          ],
        },
        {
          test: /\.txt/i,
          use: [
            {
              loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
              options: {
                resourceQuery: "test",
                use: path.resolve(fixturesDir, "testLoader1.js"),
              },
            },
            {
              loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
              options: {
                resourceQuery: "test",
                use: path.resolve(fixturesDir, "testLoader2.js"),
              },
            },
          ],
        },
      ],
    },
  };

  const wp = (webpackVersion === 5 ? webpack5 : webpack) as typeof webpack;
  const compiler = wp(fullConfig as webpack.Configuration);

  const outputFileSystem = createFsFromVolume(new Volume());
  // Todo remove when we drop webpack@4 support
  // @ts-ignore
  outputFileSystem.join = path.join.bind(path);

  // @ts-ignore
  compiler.outputFileSystem = outputFileSystem;

  return compiler;
};
