const path = require('path')

let conf = {
    entry: {
        app: './src/js/main.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, "./build/js"),
        publicPath: '/build'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        }]
    }
}


module.exports = conf;

