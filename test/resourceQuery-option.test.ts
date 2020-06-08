import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"resourceQuery" option', () => {
  it("should work with a query that is present", async () => {
    const compiler = getCompiler({
      use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
      resourceQuery: "test",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with a query that is not present", async () => {
    const compiler = getCompiler(
      {
        use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
        resourceQuery: "test2",
      },
      true
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with a negative query that is present", async () => {
    const compiler = getCompiler(
      {
        use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
        resourceQuery: "!test",
      },
      true
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with a negative query that is not present", async () => {
    const compiler = getCompiler({
      use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
      resourceQuery: "!test3",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
