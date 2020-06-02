import React from 'react';
import { Popover, Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { connect, useIntl } from 'umi';
import classNames from 'classnames';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const { formatMessage } = useIntl();
  const { theme, layout, primaryColor } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  // 动态主题切换
  const handleChangeComplete = (color) => {
    window.less.modifyVars({
      '@primary-color': color.hex || primaryColor,
    });
  };
  const colorContent = (
    <SketchPicker color={primaryColor} onChangeComplete={handleChangeComplete} />
  );

  return (
    <div className={className}>
      <HeaderSearch
        className={classNames(`${styles.action} ${styles.search}`, 'steps-search')}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="https://ant.design/">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={() => {}}
      />
      <Popover content={colorContent} title="Title">
        <Tag color={primaryColor}>{primaryColor}</Tag>
      </Popover>
      <Tooltip
        title={formatMessage({
          id: 'component.globalHeader.help',
        })}
      >
        <a
          target="_blank"
          href="https://hankaibo.github.io/myantdpro-docs/"
          rel="noopener noreferrer"
          className={classNames(styles.action, 'steps-reference')}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <Avatar />
      {REACT_APP_ENV && (
        <span className="steps-env">
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={classNames(styles.action, 'steps-language')} />
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  primaryColor: settings.primaryColor,
}))(GlobalHeaderRight);
