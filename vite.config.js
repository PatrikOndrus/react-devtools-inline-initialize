const path = require("path");

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "iteriaDevtools",
      formats: ["umd"],
    },
  },
};
