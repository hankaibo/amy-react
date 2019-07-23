import React, { useEffect } from 'react';
import { Form, Input, Modal, Switch, message } from 'antd';

const FormItem = Form.Item;

const RoleForm = Form.create({ name: 'roleForm' })(props => {
  const { visible, handleCancel, form, dispatch, systemRole } = props;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;
  const { info } = systemRole;
  const isEdit = info && info.id;

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (Object.keys(info).length > 0) {
      setFieldsValue(info);
    }
  }, [info, setFieldsValue]);

  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (isEdit) {
        dispatch({
          type: 'systemRole/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemRole/fetch',
              payload: {
                current: 1,
                pageSize: 10,
              },
            });
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemRole/add',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemRole/fetch',
              payload: {
                current: 1,
                pageSize: 10,
              },
            });
            message.success('添加成功');
          },
        });
      }
    });
  };

  return (
    <Modal
      destroyOnClose
      title={isEdit ? '修改' : '新增'}
      visible={visible}
      onOk={handleAddOrUpdate}
      onCancel={() => handleCancel()}
    >
      {isEdit && getFieldDecorator('id', {})(<Input hidden />)}
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
    </Modal>
  );
});

export default RoleForm;
