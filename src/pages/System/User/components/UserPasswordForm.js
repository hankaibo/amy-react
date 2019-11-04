import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';

const FormItem = Form.Item;

const UserPasswordForm = connect()(
  Form.create({ name: 'userPasswordForm' })(({ children, user, form, dispatch }) => {
    const { validateFields, getFieldDecorator, setFieldsValue } = form;

    // 【模态框显示隐藏属性】
    const [visible, setVisible] = useState(false);

    // 【模态框显示隐藏函数】
    const showModalHandler = e => {
      if (e) e.stopPropagation();
      setVisible(true);
    };
    const hideModelHandler = () => {
      setVisible(false);
    };

    useEffect(() => {
      if (visible) {
        const { id } = user;
        setFieldsValue({ id, password: '123456' });
      }
    }, [visible, user, setFieldsValue]);

    // 【重置密码】
    const handleReset = () => {
      validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
          type: 'systemUser/reset',
          payload: fieldsValue,
          callback: () => {
            hideModelHandler();
            message.success('重置密码成功。');
          },
        });
      });
    };

    return (
      <span>
        <span onClick={showModalHandler}>{children}</span>
        <Modal
          destroyOnClose
          title={`您确定要重置${user.nickname}的密码吗？`}
          visible={visible}
          onOk={handleReset}
          onCancel={hideModelHandler}
          footer={[
            <Button key="back" onClick={hideModelHandler}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleReset}>
              确定
            </Button>,
          ]}
        >
          <Form>
            {getFieldDecorator('id')(<Input hidden />)}
            <FormItem label="新密码" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请将密码长度保持在6至31字符之间！',
                    min: 6,
                    max: 31,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  })
);

export default UserPasswordForm;
