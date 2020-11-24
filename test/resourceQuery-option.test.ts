import WQLWebpackTestCompiler from "./helpers/WQLWebpackTestCompiler";

describe.each([4, 5] as const)(
  'v%d "resourceQuery" option',
  (webpackVersion) => {
    it("should work with a query that is present", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: "test",
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with a query that is not present", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: "test2",
        },
        useUrlLoader: true,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with a negative query that is present", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: "!test",
        },
        useUrlLoader: true,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with a negative query that is not present", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: "!test3",
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with multiple queries, both true", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: ["!test3", "test"],
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with multiple queries, one false", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: ["!test3", "!test"],
        },
        useUrlLoader: true,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with multiple queries, both false", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: ["test3", "!test"],
        },
        useUrlLoader: true,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with a function that returns false", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: () => false,
        },
        useUrlLoader: true,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with a function that returns true", async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: () => true,
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should call the function with the correct arguments", async () => {
      const mockResourceQuery = jest.fn().mockReturnValue(true);

      const compiler = new WQLWebpackTestCompiler({ webpackVersion });
      await compiler.compile({
        loaderOptions: {
          use: "file-loader",
          resourceQuery: function (
            resource: string,
            resourceQuery: string,
            query: Record<string, unknown>
          ) {
            return mockResourceQuery(resource, resourceQuery, query);
          },
        },
      });

      expect(mockResourceQuery).toHaveBeenCalled();
      expect(mockResourceQuery).toMatchSnapshot();
    });
  }
);
