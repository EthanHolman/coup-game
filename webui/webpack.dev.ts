import path from "path";
import { Configuration as WebpackConfiguration, DefinePlugin } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import getClientEnvironment from "./env";
import merge from "webpack-merge";
import common from "./webpack.common";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const configDev: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
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
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true,
    client: {
      overlay: false,
    },
    allowedHosts: "all",
  },
};

export default merge(common, configDev);
