import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'umi';
import styles from '@/pages/System/System.less';

const UserPasswordForm = connect()(({ children, id, username, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  // 【模态框显示隐藏属性】
  const [visible, setVisible] = useState(false);

  // 【模态框显示隐藏函数】
  const showModalHandler = (e) => {
    if (e) e.stopPropagation();
    setVisible(true);
  };
  const hideModelHandler = () => {
    setFieldsValue();
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      setFieldsValue({ password: '123456' });
    }
  }, [visible, setFieldsValue]);

  // 【重置密码】
  const handleReset = (values) => {
    dispatch({
      type: 'systemUser/reset',
      payload: {
        ...values,
        id,
      },
      callback: () => {
        hideModelHandler();
        message.success('重置用户密码成功。');
      },
    });
  };

  // 【表单布局】
  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 19, offset: 5 },
    },
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        forceRender
        destroyOnClose
        title={`您确定要重置 ${username} 的密码吗？`}
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="userPasswordForm"
          className={styles.form}
          onFinish={handleReset}
        >
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请将密码长度保持在6至32字符之间！',
                min: 6,
                max: 32,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={hideModelHandler}>取消</Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default UserPasswordForm;
