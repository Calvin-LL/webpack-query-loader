import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)("v%d no query", (webpackVersion) => {
  it("should work when no query is present and resourceQuery is true", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        use: "file-loader",
        resourceQuery: "!test",
      },
      false,
      "simple-no-query.js"
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work when no query is present and resourceQuery is false", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        use: "file-loader",
        resourceQuery: "test",
      },
      true,
      "simple-no-query.js"
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
