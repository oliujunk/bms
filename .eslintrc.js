module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-debugger': 'off',
    'max-len': ['error', { "code": 180 }],
    'no-multi-assign': 'off',
    'no-console': 'off',
  },
};
