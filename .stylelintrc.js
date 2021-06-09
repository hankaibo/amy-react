// https://stylelint.io/
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules', 'stylelint-config-prettier'],
  plugins: [
    'stylelint-order',
    // https://github.com/constverum/stylelint-config-rational-order/issues/10
    'stylelint-config-rational-order/plugin',
    'stylelint-declaration-block-no-ignored-properties',
  ],
  rules: {
    'no-descending-specificity': null,
    // https://github.com/stylelint/stylelint/issues/4114
    'function-calc-no-invalid': null,
    'function-url-quotes': 'always',
    'font-family-no-missing-generic-family-keyword': null, // iconfont
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx'],
};
