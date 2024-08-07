const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'development', // 開発モードを設定
  entry: './src/consolidatedApp.js', // エントリーポイントを指定
  output: {
    path: path.resolve(__dirname, 'public'), // 出力ディレクトリを指定
    filename: 'bundle.js', // 出力ファイル名を指定
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 対象ファイルの拡張子を指定
        exclude: /node_modules/, // 除外するディレクトリを指定
        use: {
          loader: 'babel-loader', // 使用するローダーを指定
          options: {
            presets: ['@babel/preset-react'], // Babelのプリセットを指定
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 解決する拡張子を指定
  },
  devtool: 'source-map', // 'eval'の代わりに'source-map'を使用
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
};
