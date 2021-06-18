const path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const dotenv = require('dotenv');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WorkboxPlugin = require('workbox-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const getClientEnvironment = require('./utils/env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  path.resolve(__dirname, '../.env.production.local'),
  path.resolve(__dirname, '../.env.production'),
  path.resolve(__dirname, '../.env')
].filter((dotenvFile) => fs.existsSync(dotenvFile));

console.log(`${dotenvFiles[0]} will be used.\n`);

// Load env variables
dotenv.config({
  path: dotenvFiles[0]
});

const clientEnv = getClientEnvironment('production');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  target: 'browserslist',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'assets/js/[name].[chunkhash:8].js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: (() => {
        // Optimize CSS chunks so that it doesn't combine into 1 giant file
        const CSS_FOLDER_PATH = path.resolve(__dirname, '../src/assets/scss/');
        const cacheGroupsConfig = {};
        const cssChunks = fs.readdirSync(CSS_FOLDER_PATH)
          .filter((filename) => {
            const fileStats = fs.statSync(path.join(CSS_FOLDER_PATH, filename));
            return fileStats.isFile() && /^(?!_)(.+)\.scss(\?.*)?$/.test(filename);
          })
          .map((name) => name.replace(/\.s?css/i, ''));

        cssChunks.forEach((chunk) => {
          cacheGroupsConfig[chunk] = {
            name: chunk,
            test: new RegExp(`${chunk}\\.s?css$`),
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true
          };
        });

        return cacheGroupsConfig;
      })()
    }
  },
  plugins: [
    new Webpack.DefinePlugin(clientEnv.stringified),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[chunkhash:8].css'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: false,
      skipWaiting: false,
      offlineGoogleAnalytics: true
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-analyzer-plugin-report.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              envName: 'production'
            }
          },
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false
              }
            }
          }
        ]
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            envName: 'production'
          }
        }]
      },
      {
        test: /\.s?css/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  autoprefixer()
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
});
