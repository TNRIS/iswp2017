var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './app/public/src/entry.jsx',
  output: {
    path: './app/public/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'app/public/src/vendor/'),
          path.resolve(__dirname, 'node_modules'),
        ],
        loader: ExtractTextPlugin.extract('css')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.(es|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'babel!svg-react-loader'
      }
    ]
  },
  resolve: {
    // allows extension-less require/import statements for files with these extensions
    extensions: ['', '.es', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
