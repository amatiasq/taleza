module.exports = {
  devtool: 'source-map',
  entry: './src/main.tsx',
  bail: true,

  output: {
    filename: './dist/bundle.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },

  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    }]
  },

  devServer: {
    inline: true,
    stats: {
      colors: true,
      progress: true,
    },
  },
};
