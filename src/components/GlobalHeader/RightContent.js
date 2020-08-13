import React from 'react';
import { Tag, Tooltip, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect, useIntl, SelectLang } from 'umi';
import classNames from 'classnames';
import { PhotoShopPicker } from '@/components/ColorPicker';
import Avatar from './AvatarDropdown';
import NoticeIconView from './NoticeIconView';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const { formatMessage } = useIntl();
  const { theme, layout, primaryColor, dispatch } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const handleChangeComplete = (data) => {
    if (data.hsl !== primaryColor) {
      // 动态修改color.less文件
      window.less.modifyVars({
        '@primary-color': data.hex,
      });
      // 修改全局state中的primaryColor
      dispatch({
        type: 'settings/changeSetting',
        payload: {
          primaryColor: data.hex,
        },
      });
    }
    // 可以调用父组件事件
    // props.onChange && props.onChange(data.hex);
  };

  return (
    <div className={className}>
      <HeaderSearch
        className={classNames(`${styles.action} ${styles.search}`)}
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
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={() => {}}
      />
      <Tooltip
        title={formatMessage({
          id: 'component.globalHeader.help',
        })}
      >
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://hankaibo.github.io/myantdpro-docs/"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <NoticeIconView />
      <Avatar menu />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <Popover
        content={<PhotoShopPicker color={primaryColor} onChangeComplete={handleChangeComplete} />}
        title="动态换肤"
      >
        <span>
          <Tag color={primaryColor}>{primaryColor}</Tag>
        </span>
      </Popover>
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  primaryColor: settings.primaryColor,
}))(GlobalHeaderRight);
