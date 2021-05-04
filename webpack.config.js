const HtmlPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = ({ NODE_ENV }) => ({
    mode: NODE_ENV,
    target: 'web',
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, './src/index.jsx')
    ],
    output: {
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
        new HtmlPlugin({
            template: path.resolve(__dirname, './src/index.html')
        }),
        new NodePolyfillPlugin({
            preferBuiltins: true
        })
    ],
    devServer: {
        port: 8080,
        publicPath: '/'
    },
    devtool: 'source-map'
})