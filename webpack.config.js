const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: 'source-map',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 8080,
    host: "localhost",
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          'source-map-loader',
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' })
  ],
};
