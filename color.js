const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  mainLessFile: path.join(__dirname, './src/styles/main.less'),
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
    '@border-color-base',
    '@white',
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'),
  customColorRegexArray: [/^fade\(.*\)$/],
};

generateTheme(options)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Theme generated successfully');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('Error', error);
  });
