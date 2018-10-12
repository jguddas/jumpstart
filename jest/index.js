const extToRegex = (...args) => `\\.${args.join('|')}`
module.exports = {
  rootDir: process.cwd(),
  moduleFileExtensions: ['js', 'jsx', 'lsc', 'lsx', 'ts', 'tsx'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|ls[cx]|tsx?)$',
  transform: {
    "\\.jsx?(\\?.*)?$": require.resolve('./javascript.jest.js'),
    "\\.ls[cx](\\?.*)?$": require.resolve('./lightscript.jest.js'),
    "\\.tsx?(\\?.*)?$": require.resolve('./typescript.jest.js'),
    "\\.(png|jpe?g|svg|woff2?|ttf|eot)(\\?.*)?$": require.resolve('./file.jest.js'),
  },
  moduleNameMapper: {
    "\\.(css|s[ca]ss|less)(\\?.*)?$": "identity-obj-proxy"
  },
}
