import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

export default {
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        path: path.resolve(_dirname, './dist/js'),
        filename: 'bundle.min.js'
    },
    devtool: 'eval-source-map',
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin()
    ]
}