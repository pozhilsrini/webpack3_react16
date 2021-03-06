import webpack from 'webpack';  // eslint-disable-line
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';

const config = {
  entry: {
    app: [
      './src/webpack-public-path',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, 'src/index.js'), // Defining path seems necessary for this to work consistently on Windows machines.
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: '[name].[hash].bundle.js',
  },

  target: 'web',

  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },

  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.js.org/guides/development/#using-source-maps and https://webpack.js.org/configuration/devtool/

  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: ['file-loader'] },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } }] },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream' } }] },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'image/svg+xml' } }] },
      { test: /\.(jpe?g|png|gif|ico)$/i, use: [{ loader: 'file-loader', options: { name: '[name].[ext]' } }] },
      {
        test: /(\.css|\.scss|\.sass)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer'),
              ],
              sourceMap: true,
            },
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src', 'scss')],
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
      template: path.join(__dirname, 'src', 'index.ejs'),
      favicon: path.join(__dirname, 'src', 'favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['commons', 'app'],
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      noInfo: false, // set to false to see a list of every file being bundled.
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, 'src', 'scss')],
        },
        context: '/',
        postcss: () => [autoprefixer],
      },
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['commons'],
    }),
  ],
};

export default config;
