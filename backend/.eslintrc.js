module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "eqeqeq": "off",
    "curly": "warn",
    "quotes": ["warn", "double"]
  }
}
