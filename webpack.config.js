const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/index.ts',
    module:{
        rules: [
            {
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            css: path.resolve(__dirname, 'src/css/'),
            img: path.resolve(__dirname, 'src/img/'),
        },
    },
    output: {
        filename: 'bundle-[hash].js',
        path: path.resolve(__dirname,'build'),
        clean: true,
    },
    devtool: "source-map",
    mode:'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'template.html',
            title: "Chess game",
            inject: "body",
            scriptLoading: "module",
        }),
        new MiniCssExtractPlugin({
            filename: 'style-[hash].css',
        }),
    ],
}
