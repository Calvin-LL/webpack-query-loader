import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe("complex loaders", () => {
  it("should work when multiple loaders with pitch stage is present", async () => {
    const compiler = getCompiler({}, false, "complex.js");
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
    expect((stats as webpack.Stats).compilation.warnings).toMatchSnapshot(
      "warnings"
    );
  });
});
