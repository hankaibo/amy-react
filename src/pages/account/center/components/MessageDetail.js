import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { connect } from 'umi';

const { Title, Paragraph, Text } = Typography;

const MessageDetail = connect(({ user: { message } }) => ({
  message,
}))(({ id, from, message, dispatch }) => {
  // 【修改时，获取信息表单数据】
  useEffect(() => {
    dispatch({
      type: 'user/fetchMessageById',
      payload: {
        id,
        from,
      },
    });
    return () => {
      dispatch({
        type: 'user/clearMessage',
      });
    };
  }, [id, from, dispatch]);

  return (
    <Typography>
      <Title level={3}>{message.title}</Title>
      <Paragraph>
        <ul>
          <li>
            <span>发件人：</span>
            <a href="#">{message.sendId}</a>
          </li>
          <li>
            <span>时间：</span>
            <a href="#">{message.publishTime}</a>
          </li>
          <li>
            <span>收件人：</span>
            <a href="#">{message.receiveNameList}</a>
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        <Text keyboard>{message.content}</Text>
      </Paragraph>
    </Typography>
  );
});

export default MessageDetail;
