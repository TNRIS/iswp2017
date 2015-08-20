var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./client/index.es6",
  output: {
    path: __dirname + '/server/public/',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      { 
        test: /\.es6$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
