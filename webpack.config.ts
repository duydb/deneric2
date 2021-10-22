const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/deneric.ts',
  // devtool: 'inline-source-map',
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
    filename: 'deneric.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
