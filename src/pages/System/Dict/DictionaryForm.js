import React, { useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Switch, message } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const DictionaryForm = Form.create({ name: 'dictionaryForm' })(props => {
  const { visible, handleCancel, form, dispatch, systemDictionary, ...rest } = props;
  const { location, match } = rest;
  const {
    query: { name: parentName },
  } = location;
  const {
    params: { id: parentId },
  } = match;
  const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;
  const { info } = systemDictionary;
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
          type: 'systemDictionary/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemDictionary/fetch',
              payload: {
                parentId,
              },
            });
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemDictionary/add',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            handleCancel();
            dispatch({
              type: 'systemDictionary/fetch',
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
        {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
          <Switch checkedChildren="开" unCheckedChildren="关" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {getFieldDecorator('sort')(<InputNumber placeholder="请输入字典排序" style={{ width: '100%' }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {getFieldDecorator('description')(
          <TextArea placeholder="请输入字典描述" autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
    </Modal>
  );
});

export default DictionaryForm;
