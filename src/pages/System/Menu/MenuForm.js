import React, { useEffect } from 'react';
import { Form, Input, Modal, Switch, message, TreeSelect } from 'antd';

const FormItem = Form.Item;

const MenuForm = Form.create({ name: 'menuForm' })(props => {
  const { visible, handleCancel, form, dispatch, systemMenu } = props;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;
  const { info, menuTree } = systemMenu;
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
          type: 'systemMenu/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemMenu/fetch',
              payload: {},
            });
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemMenu/add',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemMenu/fetch',
              payload: {},
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
      {isEdit && getFieldDecorator('id')(<Input hidden />)}
      {getFieldDecorator('type', { initialValue: 1 })(<Input hidden />)}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
          <Switch checkedChildren="开" unCheckedChildren="关" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级菜单">
        {getFieldDecorator('parentId')(
          <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={menuTree}
            placeholder="请选择菜单"
            treeDefaultExpandAll
          />
        )}
      </FormItem>
    </Modal>
  );
});

export default MenuForm;
