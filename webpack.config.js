const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // output: {
    //     filename: 'bundle.js'
    // },
    mode: 'production',
    devServer: {
        port: 7070
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },

    entry: {
        index: "./src/index.js",
        editor: "./src/editor.js",
        game: "./src/game.js"
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: true,
            chunks: ["index"],
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/editor.html",
            inject: true,
            chunks: ["editor"],
            filename: "editor.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/game.html",
            inject: true,
            chunks: ["game"],
            filename: "game.html"
        })
    ]
};