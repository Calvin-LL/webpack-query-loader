import WQLWebpackTestCompiler from "./helpers/WQLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "use" option', (webpackVersion) => {
  it('should work with "file-loader" value without resourceQuery', async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        use: "file-loader",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "file-loader" value with resourceQuery', async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        use: "file-loader",
        resourceQuery: "test",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "object" value with resourceQuery', async () => {
    const compiler = new WQLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        use: { loader: "file-loader", options: { name: "[path][name].[ext]" } },
        resourceQuery: "test",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
