const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends('universe/native', 'universe/web'),
  {
    ignores: ['build/**'],
    rules: {
      // eslint-plugin-node is not fully compatible with ESLint v9.
      'node/handle-callback-err': 'off',
    },
  },
];
