const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/favicon/clock-180px.png", to: "apple-touch-icon.png" },
                { from: "src/favicon/clock-192px.png", to: "icon-192px.png" },
                { from: "src/favicon/clock-512px.png", to: "icon-512px.png" },
                { from: "src/favicon/clock.ico", to: "favicon.ico" },
                { from: "src/favicon/clock.svg", to: "icon.svg" },
                { from: "src/favicon/manifest.webmanifest", to: "manifest.webmanifest" },
                { from: "src/images", to: "images" },
            ],
        }),
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ]
    }
};
