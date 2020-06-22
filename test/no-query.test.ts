import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe("no query", () => {
  it("should work when no query is present and resourceQuery is true", async () => {
    const compiler = getCompiler(
      {
        use: "file-loader",
        resourceQuery: "!test",
      },
      false,
      "simple-no-query.js"
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work when no query is present and resourceQuery is false", async () => {
    const compiler = getCompiler(
      {
        use: "file-loader",
        resourceQuery: "test",
      },
      true,
      "simple-no-query.js"
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
