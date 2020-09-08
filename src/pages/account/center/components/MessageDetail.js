import React, { useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { connect } from 'umi';

const { Title, Paragraph, Text } = Typography;

const MessageDetail = connect(({ user: { message } }) => ({
  message,
}))(({ visible, id, from, message, closeModal, dispatch }) => {
  // 【修改时，获取信息表单数据】
  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'user/fetchMessageById',
        payload: {
          id,
          from,
        },
      });
    }
    return () => {
      dispatch({
        type: 'user/clearMessage',
      });
    };
  }, [visible, id, dispatch]);

  return (
    <Modal destroyOnClose title="详情" visible={visible} onCancel={closeModal} footer={null}>
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
    </Modal>
  );
});

export default MessageDetail;
