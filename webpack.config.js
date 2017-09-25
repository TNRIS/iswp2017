var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var isProdBuild = process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging';

var extractText = new ExtractTextPlugin(
  isProdBuild ? 'styles.[hash].css' : 'styles.css'
);

var assets = new AssetsPlugin({
  prettyPrint: true,
  path: path.join(__dirname, 'app')
});

var uglify = new webpack.optimize.UglifyJsPlugin();

var plugins = [extractText, assets];
if (isProdBuild) {
  plugins.push(uglify);
}

module.exports = {
  entry: path.join(__dirname, './app/public/src/entry.jsx'),
  output: {
    path: path.join(__dirname, '/app/public/dist/'),
    filename: isProdBuild ? 'scripts.[hash].js' : 'scripts.js'
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
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
        use: extractText.extract({
          fallback: 'style-loader',
          use: "css-loader!sass-loader"
        })
      },
      {
        test: /\.(es|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        //include react-pivot specifically as requiring babel-loader
        // due to the way it is packaged
        test: /\.(jsx)$/,
        include: /node_modules\/react-pivot/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'babel-loader!svg-react-loader'
      }
    ]
  },
  resolve: {
    // allows extension-less require/import statements for files with these extensions
    extensions: ['.es', '.js', '.jsx']
  },
  plugins: plugins
};
