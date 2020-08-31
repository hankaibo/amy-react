import React, { useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { connect } from 'umi';

const { Title, Paragraph, Text } = Typography;

const MsgDetail = connect(({ user: { msg } }) => ({
  msg,
}))(({ visible, id, msg, closeModal, dispatch }) => {
  // 【修改时，获取信息表单数据】
  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'user/fetchMessageById',
        payload: {
          id,
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
        <Title level={3}>{msg.title}</Title>
        <Paragraph>
          <ul>
            <li>
              <span>发件人：</span>
              <a href="#">{msg.sendId}</a>
            </li>
            <li>
              <span>时间：</span>
              <a href="#">{msg.publishTime}</a>
            </li>
            <li>
              <span>收件人：</span>
              <a href="#">{msg.receiveNameList}</a>
            </li>
          </ul>
        </Paragraph>

        <Paragraph>
          <Text keyboard>{msg.content}</Text>
        </Paragraph>
      </Typography>
      ,
    </Modal>
  );
});

export default MsgDetail;
