const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const isProdBuild = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging';

const extractText = new ExtractTextPlugin(
  isProdBuild ? 'styles.[hash].css' : 'styles.css'
);

const assets = new AssetsPlugin({
  prettyPrint: true,
  path: path.join(__dirname, 'app'),
});

const uglify = new webpack.optimize.UglifyJsPlugin();

const plugins = [extractText, assets];
if (isProdBuild) {
  plugins.push(uglify);
}

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, 'app/public/src/entry.jsx')],
  output: {
    path: path.join(__dirname, 'app/public/dist/'),
    filename: isProdBuild ? 'scripts.[hash].js' : 'scripts.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'app/public/src/vendor/'),
          path.resolve(__dirname, 'node_modules'),
        ],
        use: extractText.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: extractText.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        }),
      },
      {
        test: /\.(es|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        // include react-pivot specifically as requiring babel-loader
        // due to the way it is packaged
        test: /\.(jsx)$/,
        include: /node_modules\/react-pivot/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'babel-loader!svg-react-loader',
      },
    ],
  },
  resolve: {
    // allows extension-less require/import statements for 
    // files with these extensions
    extensions: ['.es', '.js', '.jsx'],
  },
  plugins,
};
