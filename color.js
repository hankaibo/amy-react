const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src'), // all files with .less extension will be processed
  varFile: path.join(__dirname, './src/styles/variables.less'), // default path is Ant Design default.less file
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
  outputFilePath: path.join(__dirname, './public/color.less'), // if provided, file will be created with generated less/styles
};

generateTheme(options)
  .then(() => {
    console.log('Theme generated successfully');
  })
  .catch((error) => {
    console.log('Error', error);
  });
