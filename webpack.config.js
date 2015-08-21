var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./app/public/src/entry.js",
  output: {
    path: __dirname + '/app/public/dist/',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      { 
        test: /\.(es6|jsx|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
