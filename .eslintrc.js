module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier'],
  globals: {
    REACT_APP_ENV: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['eslint-comments', 'unicorn', 'react-hooks'],
  rules: {
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/sort-comp': 1,
    'react/jsx-one-expression-per-line': 0,
    'generator-star-spacing': 0,
    'function-paren-newline': 0,
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^@@/', '^@alipay/bigfish/'],
        caseSensitive: true,
        commonjs: true,
      },
    ],
    'import/order': 'warn',
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: [
          '**/tests/**.{ts,js,jsx,tsx}',
          '**/_test_/**.{ts,js,jsx,tsx}',
          '/mock/**/**.{ts,js,jsx,tsx}',
          '**/**.test.{ts,js,jsx,tsx}',
          '**/_mock.{ts,js,jsx,tsx}',
          '**/example/**.{ts,js,jsx,tsx}',
          '**/examples/**.{ts,js,jsx,tsx}',
        ],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': [0, 'camel-case'],
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'sort-imports': 0,
    // Use function hoisting to improve code readability
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    'import/no-cycle': 0,
    'react/no-array-index-key': 'warn',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react/require-default-props': 0,
    'react/jsx-fragments': 0,
    // Conflict with prettier
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'eslint-comments/no-unlimited-disable': 0,
    'no-param-reassign': 2,
    'space-before-function-paren': 0,
    'import/extensions': 0,
  },
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
    polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
  },
};
