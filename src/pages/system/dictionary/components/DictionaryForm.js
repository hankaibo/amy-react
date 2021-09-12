import React, { useEffect } from 'react';
import { Button, Form, Input, message, Switch } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';

const DictionaryForm = connect(({ systemDictionary: { dictionary }, loading }) => ({
  dictionary,
  loading:
    loading.effects['systemDictionary/fetchById'] ||
    loading.effects['systemDictionary/add'] ||
    loading.effects['systemDictionary/update'],
}))(({ loading, isEdit, id, dictionary, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;

  // 【修改时，获取字典表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemDictionary/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      if (isEdit) {
        dispatch({
          type: 'systemDictionary/clear',
        });
      }
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显字典表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(dictionary)) {
        setFieldsValue(dictionary);
      }
    }
  }, [isEdit, dictionary, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (id) {
      dispatch({
        type: 'systemDictionary/update',
        payload: {
          ...values,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('修改字典成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemDictionary/add',
        payload: {
          ...values,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('添加字典成功。');
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
      name="DictionaryForm"
      className="form"
      initialValues={{
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item label="字典名称" name="name" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="字典编码" name="code" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="字典状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="字典描述" name="description" rules={[{ max: 255 }]}>
        <Input.TextArea placeholder="请输入字典描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
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

export default DictionaryForm;
