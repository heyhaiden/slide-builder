const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './src/js/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash].js',
      clean: true,
    },
    devtool: isProduction ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './public/favicon.ico',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [
          { 
            from: "public", 
            to: "" 
          },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      hot: true,
      port: 3000,
      open: true,
    },
    performance: {
      hints: isProduction ? 'warning' : false,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};