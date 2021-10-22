const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    deneric: './src/deneric.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget:'umd',
    library: 'Deneric',
    umdNamedDefine: true,
    globalObject: 'this'
  }
};
