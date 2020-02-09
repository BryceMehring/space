const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkerPlugin = require('worker-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const dist = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    main: './source/app.ts',
  },
  output: {
    path: dist,
    filename: '[name].[contenthash].js',
    globalObject: 'self',
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  devServer: {
    contentBase: dist,
    compress: true,
    overlay: true,
    open: true,
    port: 9000,
  },
  devtool: 'source-maps',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // translates CSS into CommonJS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkerPlugin(),
    new HtmlWebpackPlugin({
      template: 'source/index.html',
      excludeChunks: ['worker'],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    },
  },
};
