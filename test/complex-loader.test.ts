import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)("v%d complex loaders", (webpackVersion) => {
  it("should work when multiple loaders with pitch stage is present", async () => {
    const compiler = getCompiler(webpackVersion, {}, false, "complex.js");
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
    expect((stats as webpack.Stats).compilation.warnings).toMatchSnapshot(
      "warnings"
    );
  });
});
