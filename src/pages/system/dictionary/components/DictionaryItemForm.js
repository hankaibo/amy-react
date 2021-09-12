import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, message, Switch } from 'antd';
import { connect, history } from 'umi';
import { isEmpty } from '@/utils/utils';

const DictionaryItemForm = connect(({ systemDictionaryItem: { dictionaryItem }, loading }) => ({
  dictionaryItem,
  loading:
    loading.effects['systemDictionaryItem/fetchById'] ||
    loading.effects['systemDictionaryItem/add'] ||
    loading.effects['systemDictionaryItem/update'],
}))(({ loading, isEdit, id, dictionaryItem, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;

  // 【修改时，获取字典项表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemDictionaryItem/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      if (isEdit) {
        dispatch({
          type: 'systemDictionaryItem/clear',
        });
      }
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显字典项表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(dictionaryItem)) {
        setFieldsValue(dictionaryItem);
      }
    }
  }, [isEdit, dictionaryItem, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    const { id: dictionaryId } = history.location.query;
    if (id) {
      dispatch({
        type: 'systemDictionaryItem/update',
        payload: {
          ...values,
          dictionaryId,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('修改字典项成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemDictionaryItem/add',
        payload: {
          ...values,
          dictionaryId,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('添加字典项成功。');
        },
      });
    }
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
      name="DictionaryItemForm"
      className="form"
      initialValues={{
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item label="字典分类">
        <Input value={history.location.query.name} disabled />
      </Form.Item>
      <Form.Item label="字典项名称" name="name" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="字典项值" name="value" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="排序" name="sort">
        <InputNumber min={1} max={99} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="字典项状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="字典项描述" name="description" rules={[{ max: 255 }]}>
        <Input.TextArea placeholder="请输入字典项描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button onClick={closeModal}>取消</Button>
        <Button type="primary" loading={loading} htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
});

export default DictionaryItemForm;
