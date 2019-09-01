var glob = require('glob')

module.exports = {
	output: {
		filename: 'main.js',
	},
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
				resolve: {
					extensions: ['.js', '.jsx'],
				},
			},
		],
	},
}
