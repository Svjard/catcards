const { resolve } = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        './index.html',
        './styles.css',
        { from: './images', to: './images' },
        { from: './data/equipment.json', to: './data' }
      ],
    }),
  ],
};