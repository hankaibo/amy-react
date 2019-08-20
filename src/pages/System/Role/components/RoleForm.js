import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message } from 'antd';

const FormItem = Form.Item;

const RoleForm = Form.create({ name: 'roleForm' })(props => {
  const { children, isEdit, role, form, dispatch } = props;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;

  const [visible, setVisible] = useState(false);
  const [editRole, setEditRole] = useState({});

  const showModalHandler = e => {
    if (e) e.stopPropagation();
    setVisible(true);
  };

  const hideModelHandler = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible && isEdit) {
      const { id } = role;
      dispatch({
        type: 'systemRole/fetchById',
        payload: {
          id,
        },
        callback: () => {
          setVisible(true);
        },
      }).then(data => {
        setEditRole(data);
      });
    }
  }, [visible, isEdit, role]);

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (Object.keys(editRole).length > 0) {
        setFieldsValue(editRole);
      }
    }
  }, [visible, isEdit, editRole]);

  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (isEdit) {
        dispatch({
          type: 'systemRole/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            hideModelHandler();
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemRole/add',
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
        <Form>
          {isEdit && getFieldDecorator('id')(<Input hidden />)}
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
            })(<Input />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
            {getFieldDecorator('code', {
              rules: [{ message: '请输入至少1个字符的规则描述！', min: 1 }],
            })(<Input />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
            {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
});

export default connect(({ systemRole }) => ({
  systemRole,
}))(RoleForm);
