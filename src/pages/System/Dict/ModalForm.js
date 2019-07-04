import React, { useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Switch, message } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const ModalForm = Form.create({ name: 'dictionaryForm' })(props => {
  const { visible, handleCancel, form, dispatch, dictionary, ...rest } = props;
  const { location, match } = rest;
  const {
    query: { name: parentName },
  } = location;
  const {
    params: { id: parentId },
  } = match;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;
  const { selected } = dictionary;
  const isEdit = selected && selected.id;

  useEffect(() => {
    if (Object.keys(selected).length > 0) {
      setFieldsValue(selected);
    }
  }, [selected]);

  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'dictionary/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'dictionary/fetch',
              payload: {
                parentId,
              },
            });
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'dictionary/add',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'dictionary/fetch',
              payload: {
                parentId,
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
      {getFieldDecorator('parentId', {
        initialValue: parentId || -1,
      })(<Input hidden />)}
      {isEdit && getFieldDecorator('id', {})(<Input hidden />)}
      {parentName && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级名称">
          <Input value={parentName} disabled />
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
        })(<Input placeholder="请输入字典名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
        })(<Input placeholder="请输入字典编码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {getFieldDecorator('state', { initialValue: true, valuePropName: 'checked' })(
          <Switch checkedChildren="开" unCheckedChildren="关" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {getFieldDecorator('sort')(
          <InputNumber placeholder="请输入字典排序" style={{ width: '100%' }} />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {getFieldDecorator('description')(
          <TextArea placeholder="请输入字典描述" autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
    </Modal>
  );
});

export default ModalForm;
