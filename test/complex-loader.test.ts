import WQLWebpackTestCompiler from "./helpers/WQLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d complex loaders", (webpackVersion) => {
  it("should work when multiple loaders with pitch stage is present", async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({ entryFileName: "complex.js" });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
    expect(bundle.stats.compilation.warnings).toMatchSnapshot("warnings");
  });
});
