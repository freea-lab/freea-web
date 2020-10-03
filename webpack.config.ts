import webpack from "webpack"
import * as path from "path"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"

export default (
  env: { [key: string]: boolean | number | string },
  argv: webpack.CliConfigOptions
): webpack.Configuration => {
  const isDev =
    (env && env.development) || (argv && argv.mode === "development")

  return {
    entry: "./src/index.ts",
    mode: isDev ? "development" : "production",
    output: {
      chunkFilename: isDev
        ? "scripts/script.[name][id].js"
        : "scripts/script.[chunkahsh:6].js",
      filename: isDev
        ? "scripts/script.[name].js"
        : "scripts/script.[contenthash:6].js",
      path: path.resolve("./dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(jsx?|tsx?)$/i,
          loader: "eslint-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(jsx?|tsx?)$/i,
          loader: "babel-loader",
          exclude: { test: /node_modules/ },
        },
        {
          test: /\.(eot|otf|ttf|woff2?)$/i,
          loader: "file-loader",
          options: {
            esModule: false,
            name: "font.[hash:6].[ext]",
            outputPath: "fonts",
          },
        },
        {
          test: /\.(bmp|gif|jpe?g|png)$/i,
          loader: "file-loader",
          options: {
            esModule: false,
            name: "image.[hash:6].[ext]",
            outputPath: "images",
          },
        },
        {
          test: /\.css$/i,
          use: isDev
            ? ["style-loader", "css-loader"]
            : [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: "../" },
                },
                "css-loader",
              ],
        },
      ],
    },
    resolve: {
      alias: {
        "@assets": path.resolve("./assets"),
        "@src": path.resolve("./src"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
      disableHostCheck: true,
      hot: true,
      host: "0.0.0.0",
      historyApiFallback: true,
      https: true,
      port: 443,
    },
    plugins: isDev
      ? [
          new HtmlWebpackPlugin({
            template: path.resolve("./src/index.html"),
          }),
        ]
      : [
          new CleanWebpackPlugin(),
          new HtmlWebpackPlugin({
            template: path.resolve("./src/index.html"),
          }),
          new MiniCssExtractPlugin({
            chunkFilename: "styles/style.[chunkhash:6].css",
            filename: "styles/style.[contenthash:6].css",
          }),
        ],
  }
}
