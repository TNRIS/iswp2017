var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';

var extractTextPlugin = new ExtractTextPlugin(
  isProd ? 'styles.[hash].css' : 'styles.css'
);

var assetsPlugin = new AssetsPlugin({
  prettyPrint: true,
  path: path.join(__dirname, 'app')
});


module.exports = {
  entry: path.join(__dirname, 'app/public/src/entry.jsx'),
  output: {
    path: path.join(__dirname, 'app/public/dist/'),
    filename: isProd ? 'scripts.[hash].js' : 'scripts.js'
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
    extractTextPlugin,
    assetsPlugin
  ]
};
