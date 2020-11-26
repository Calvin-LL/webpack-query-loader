import webpack from "webpack";

import WQLWebpackTestCompiler from "./helpers/WQLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d validate options", (webpackVersion) => {
  const tests = {
    use: {
      success: [
        "file-loader",
        { loader: "file-loader" },
        { loader: "file-loader", options: { name: "[path][name].[ext]" } },
      ],
      failure: [{ options: { name: "[path][name].[ext]" } }, true],
    },
    resourceQuery: {
      success: ["test", ["test", "!test1"], () => true],
      failure: [0],
    },
  };

  function createTestCase(
    key: string,
    value: any,
    type: "success" | "failure"
  ): void {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = new WQLWebpackTestCompiler({ webpackVersion });

      let stats: webpack.Stats | undefined;

      try {
        stats = (
          await compiler.compile({
            loaderOptions: {
              use: "file-loader",
              [key]: value,
            },
            throwOnError: false,
          })
        ).stats;
      } finally {
        if (type === "success") {
          expect(stats!.hasErrors()).toBe(false);
        } else if (type === "failure") {
          const errors = stats!.compilation.errors;

          expect(errors).toHaveLength(1);
          expect(errors).toMatchSnapshot();
        }
      }
    }, 60000);
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values) as ("success" | "failure")[]) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
