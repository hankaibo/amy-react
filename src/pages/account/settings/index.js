import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';
import BaseView from './components/base';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';

const { Item } = Menu;

const Settings = ({ currentUser, dispatch }) => {
  let main = useRef(null);

  const [mode, setMode] = useState('inline');
  const [menuMap] = useState({
    base: '基本设置',
    security: '安全设置',
    notification: '消息设置',
  });
  const [selectKey, setSelectKey] = useState('base');

  const resize = () => {
    if (!main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!main) {
        return;
      }
      let m = 'inline';
      const { offsetWidth } = main;
      if (main.offsetWidth < 641 && offsetWidth > 400) {
        m = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        m = 'horizontal';
      }
      setMode(m);
    });
  };

  useEffect(() => {
    // 为了能及时查看效果
    dispatch({
      type: 'user/fetchCurrentUser',
    });
    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dispatch]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const getRightTitle = () => {
    return menuMap[selectKey];
  };

  const renderChildren = () => {
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'notification':
        return <NotificationView />;
      default:
        break;
    }

    return null;
  };

  return currentUser.id ? (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            main = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => setSelectKey(key)}>
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  ) : null;
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(Settings);
