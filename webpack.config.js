/* eslint-disable prettier/prettier */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    devServer: {
        static: './public',
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname,'src')]
            },
            {
                test:/\.(s*)css$/,
                use: [
                   miniCss.loader,
                   'css-loader',
                   'sass-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: true,
            verbose: false,
            cleanStaleWebpackAssets: false
        }),
        new HtmlWebpackPlugin({
            title: 'NewsPortal',
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html')
        }),
        new miniCss({
            filename: 'style.css',
         })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    }
}