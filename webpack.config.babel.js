import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env) => ({
  mode: env.production ? 'production' : 'development',
  entry: path.resolve(__dirname, './src/index.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },
  devtool: env.production ? false : 'eval-cheap-module-source-map',
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    contentBase: path.resolve(__dirname, './public'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/i,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
});
