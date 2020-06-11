import React from 'react';
import { List, Switch } from 'antd';

const NotificationView = () => {
  const getData = () => {
    const Action = <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />;
    return [
      {
        title: '账户密码',
        description: '其他用户的消息将以站内信的形式通知',
        actions: [Action],
      },
      {
        title: '系统消息',
        description: '系统消息将以站内信的形式通知',
        actions: [Action],
      },
      {
        title: '待办任务',
        description: '待办任务将以站内信的形式通知',
        actions: [Action],
      },
    ];
  };

  const data = getData();
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item actions={item.actions}>
          <List.Item.Meta title={item.title} description={item.description} />
        </List.Item>
      )}
    />
  );
};

export default NotificationView;
