import WQLWebpackTestCompiler from "./helpers/WQLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d no query", (webpackVersion) => {
  it("should work when no query is present and resourceQuery is true", async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        use: "file-loader",
        resourceQuery: "!test",
      },
      entryFileName: "simple-no-query.js",
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it("should work when no query is present and resourceQuery is false", async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        use: "file-loader",
        resourceQuery: "test",
      },
      entryFileName: "simple-no-query.js",
      useUrlLoader: true,
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
