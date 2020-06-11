import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"resourceQuery" option', () => {
  it("should work with a query that is present", async () => {
    const compiler = getCompiler({
      use: "file-loader",
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
        use: "file-loader",
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
        use: "file-loader",
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
      use: "file-loader",
      resourceQuery: "!test3",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with multiple queries, both true", async () => {
    const compiler = getCompiler({
      use: "file-loader",
      resourceQuery: ["!test3", "test"],
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with multiple queries, one false", async () => {
    const compiler = getCompiler(
      {
        use: "file-loader",
        resourceQuery: ["!test3", "!test"],
      },
      true
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with multiple queries, both false", async () => {
    const compiler = getCompiler(
      {
        use: "file-loader",
        resourceQuery: ["test3", "!test"],
      },
      true
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with a function that returns false", async () => {
    const compiler = getCompiler(
      {
        use: "file-loader",
        resourceQuery: () => false,
      },
      true
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with a function that returns true", async () => {
    const compiler = getCompiler({
      use: "file-loader",
      resourceQuery: () => true,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should call the function with the correct arguments", async () => {
    const mockResourceQuery = jest.fn().mockReturnValue(true);

    const compiler = getCompiler({
      use: "file-loader",
      resourceQuery: function (
        resource: string,
        resourceQuery: string,
        query: object
      ) {
        return mockResourceQuery(resource, resourceQuery, query);
      },
    });
    await compile(compiler);

    expect(mockResourceQuery).toHaveBeenCalled();
    expect(mockResourceQuery).toMatchSnapshot();
  });
});
