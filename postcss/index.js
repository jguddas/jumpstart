module.exports = ({ options }) => {
  return {
    ...options,
    plugins: [
      require('autoprefixer')(),
      require('postcss-short')(),
    ]
  }
}
