import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WQLCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: Record<string, any>;
  useUrlLoader?: boolean;
}

export default class WQLWebpackTestCompiler extends WebpackTestCompiler {
  compile(options: WQLCompileOptions = {}): Promise<WebpackTestBundle> {
    const {
      loaderOptions = {},
      entryFileName = "simple.js",
      useUrlLoader = false,
    } = options;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
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
    };

    return super.compile({
      ...options,
      entryFilePath: path.resolve(fixturesDir, entryFileName),
    });
  }
}
