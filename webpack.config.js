const path = require("path")

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public/dist"),
    publicPath: "./public/dist",
  },
}
