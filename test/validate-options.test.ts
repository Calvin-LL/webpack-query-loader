import webpack from "webpack";

import compile from "./helpers/compile";
import getCompiler from "./helpers/getCompiler";

describe("validate options", () => {
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
  ) {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = getCompiler({ use: "file-loader", ...{ [key]: value } });

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === "success") {
          expect((stats as webpack.Stats).hasErrors()).toBe(false);
        } else if (type === "failure") {
          const {
            compilation: { errors },
          } = stats as any;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
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
