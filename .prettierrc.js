// https://prettier.io/docs/en/options.html

module.exports = {
  printWidth: 120, // 80
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true, // false
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all', // es5
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  proseWrap: 'never', // preserve
  endOfLine: 'lf',
  overrides: [
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
};
