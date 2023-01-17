const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin');
// compile index.html
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//     template: './src/index.html',
//     filename: '../../dist/resume.html',
//     inject: 'body'
// });

module.exports = {
	entry: './src/index.js',
	output: {
			//can change this to dist to store in dist directory
		path: path.resolve(''),
		filename: '../../resume/index_bundle.js?v=' + new Date().getMilliseconds()
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.css$/, loader: "style-loader!css-loader" },
		]
	},
	plugins: [
    new UglifyJSPlugin()
  ]
};