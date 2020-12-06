import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'umi';

const UserPasswordForm = connect()(({ id, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields } = form;

  // 【重置密码】
  const handleReset = (values) => {
    dispatch({
      type: 'systemUser/reset',
      payload: {
        ...values,
        id,
      },
      callback: () => {
        resetFields();
        closeModal();
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
    <Form
      {...layout}
      form={form}
      name="userPasswordForm"
      className="form"
      initialValues={{
        password: '123456',
      }}
      onFinish={handleReset}
    >
      <Form.Item
        label="新密码"
        name="newPassword"
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
        <Button onClick={closeModal}>取消</Button>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
});

export default UserPasswordForm;
