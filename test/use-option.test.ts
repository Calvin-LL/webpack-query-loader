import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "use" option', (webpackVersion) => {
  it('should work with "file-loader" value without resourceQuery', async () => {
    const compiler = getCompiler(webpackVersion, {
      use: "file-loader",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "file-loader" value with resourceQuery', async () => {
    const compiler = getCompiler(webpackVersion, {
      use: "file-loader",
      resourceQuery: "test",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "object" value with resourceQuery', async () => {
    const compiler = getCompiler(webpackVersion, {
      use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
      resourceQuery: "test",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
