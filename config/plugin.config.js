// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }
  return packageName;
}

export default config => {
  if (process.env.NODE_ENV !== 'production') {
    // 将所有 less 合并为一个供 themePlugin使用
    const outFile = path.join(__dirname, '../.temp/my-ant-design-pro.less');
    const stylesDir = path.join(__dirname, '../src/');

    config.plugin('merge-less').use(MergeLessPlugin, [
      {
        stylesDir,
        outFile,
      },
    ]);

    config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
      {
        antDir: path.join(__dirname, '../node_modules/antd'),
        stylesDir,
        varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
        mainLessFile: outFile, //     themeVariables: ['@primary-color'],
        indexFileName: 'index.html',
        generateOne: true,
        lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
      },
    ]);
  }
  // optimize chunks
  config.optimization
    .runtimeChunk(false) // share the same chunks across different modules
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module);
            if (packageName) {
              return (
                [
                  'react',
                  'react-dom',
                  'react-router',
                  'react-router-dom',
                  'lodash',
                  'lodash-decorators',
                  'redux-saga',
                  're-select',
                  'dva',
                  'moment',
                ].indexOf(packageName) >= 0
              );
            }
            return false;
          },
          name(module) {
            const packageName = getModulePackageName(module);
            if (
              [
                'react',
                'react-dom',
                'react-router',
                'react-router-dom',
                'lodash',
                'lodash-decorators',
                'redux-saga',
                're-select',
                'dva',
                'moment',
              ].indexOf(packageName) >= 0
            ) {
              return 'vendors';
            }
            return 'misc';
          },
          priority: 30,
        },
        antd: {
          test: module => {
            const packageName = getModulePackageName(module);
            if (packageName) {
              return ['antd', '@ant-design'].indexOf(packageName) >= 0;
            }
            return false;
          },
          name(module) {
            const packageName = getModulePackageName(module);
            if (['antd', '@ant-design'].indexOf(packageName) >= 0) {
              return 'antdesigns'; // visualization package
            }
            return 'antdesigns';
          },
          priority: 20,
        },
      },
    });
};
