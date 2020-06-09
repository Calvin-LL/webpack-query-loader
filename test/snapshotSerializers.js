const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

module.exports = {
  print: function print(val) {
    return `"${val.replace(projectRoot, "<rootDir>")}"`;
  },
  test(val) {
    return typeof val === "string";
  },
};
