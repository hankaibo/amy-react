import React from 'react';
import { List } from 'antd';

const SecurityView = () => {
  const getData = () => [
    {
      title: '强',
      description: '当前密码强度：强',
      actions: [<a key="Modify"> 修改 </a>],
    },
    {
      title: '密保手机',
      description: '已绑定手机：186****5678',
      actions: [<a key="Modify"> 修改 </a>],
    },
    {
      title: '备用邮箱',
      description: '已绑定邮箱：ant***mail.com',
      actions: [<a key="Modify"> 修改 </a>],
    },
  ];

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

export default SecurityView;
