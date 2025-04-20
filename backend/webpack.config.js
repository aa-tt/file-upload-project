// filepath: /Users/aa/abcc/file-upload-project/backend/webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/handler.ts",
  output: {
    filename: "index.js", // Ensure the output file is named index.js
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};