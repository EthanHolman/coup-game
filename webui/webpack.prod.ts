import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import ESLintPlugin from "eslint-webpack-plugin";
import { Configuration, DefinePlugin } from "webpack";
import getClientEnvironment from "./env";
import merge from "webpack-merge";
import common from "./webpack.common";

const configProd: Configuration = {
  mode: "production",
  output: {
    filename: "bundle.js", // Output bundle file name
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
    new DefinePlugin({
      "process.env": getClientEnvironment(),
    }),
  ],
};

export default merge(common, configProd);
