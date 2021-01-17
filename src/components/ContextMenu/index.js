import React from 'react';
import { Popover } from 'antd';
import useContextMenu from './useContextMenu';
import styles from './index.less';

const ContextMenu = (props) => {
  const { children, ...rest } = props;
  const { xPos, yPos, showMenu } = useContextMenu();

  if (showMenu) {
    return (
      <Popover {...rest} visible={showMenu} content={children} title="Title">
        <div
          className={styles.menu}
          style={{
            top: yPos,
            left: xPos,
          }}
        />
      </Popover>
    );
  }
  return null;
};

export default ContextMenu;
