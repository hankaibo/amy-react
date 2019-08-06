import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, Radio } from 'antd';

const FormItem = Form.Item;

const UserForm = Form.create({ name: 'userForm' })(props => {
  const { children, isEdit, record, form, dispatch } = props;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;

  const [visible, setVisible] = useState(false);
  const [editUser, setEditUser] = useState({});

  const showModalHandler = e => {
    if (e) e.stopPropagation();
    setVisible(true);
  };

  const hideModelHandler = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible && isEdit) {
      const { id } = record;
      dispatch({
        type: 'systemUser/fetchById',
        payload: {
          id,
        },
        callback: () => {
          setVisible(true);
        },
      }).then(data => {
        setEditUser(data);
      });
    }
  }, [visible, isEdit, record]);

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (Object.keys(editUser).length > 0) {
        setFieldsValue(editUser);
      }
    }
  }, [visible, isEdit, editUser]);

  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (isEdit) {
        dispatch({
          type: 'systemUser/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            hideModelHandler();
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemUser/add',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            hideModelHandler();
            message.success('添加成功');
          },
        });
      }
    });
  };

  return (
    <span>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        destroyOnClose
        title={isEdit ? '修改' : '新增'}
        visible={visible}
        onOk={handleAddOrUpdate}
        onCancel={hideModelHandler}
      >
        {isEdit && getFieldDecorator('id')(<Input hidden />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="头像">
          {getFieldDecorator('avatar')(<Input />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
          })(<Input />)}
        </FormItem>
        {!isEdit && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 6 }],
            })(<Input type="password" />)}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {getFieldDecorator('nickname', {
            rules: [{ message: '请输入至少1个字符的规则描述！', min: 1 }],
          })(<Input />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="真实姓名">
          {getFieldDecorator('realName', {
            rules: [{ message: '请输入至少1个字符的规则描述！', min: 1 }],
          })(<Input />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {getFieldDecorator('status', {
            initialValue: true,
            valuePropName: 'checked',
          })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: '请输入正确的邮箱。' }],
          })(<Input type="email" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="座机号码">
          {getFieldDecorator('phone', {
            rules: [{ message: '请输入至少1个字符的规则描述！', min: 1 }],
          })(<Input />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {getFieldDecorator('mobile', {
            rules: [{ message: '请输入至少1个字符的规则描述！', min: 1 }],
          })(<Input />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {getFieldDecorator('sex')(
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
              <Radio value={3}>保密</Radio>
              <Radio value={4}>中性</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Modal>
    </span>
  );
});

export default connect(({ systemUser }) => ({
  systemUser,
}))(UserForm);
