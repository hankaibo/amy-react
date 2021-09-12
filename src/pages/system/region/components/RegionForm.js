import React, { useEffect } from 'react';
import { Button, Form, Input, message, Switch, TreeSelect } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';

const RegionForm = connect(({ systemRegion: { tree, region }, loading }) => ({
  tree,
  region,
  // 数组写多个无效，直接使用model又不够细粒度。
  loading:
    loading.effects['systemRegion/fetchById'] ||
    loading.effects['systemRegion/add'] ||
    loading.effects['systemRegion/update'],
}))(({ loading, isEdit, id, region, tree, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【修改时，获取区域表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemRegion/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      if (isEdit) {
        dispatch({
          type: 'systemRegion/clear',
        });
      }
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显区域表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(region)) {
        setFieldsValue(region);
      }
    }
  }, [isEdit, region, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      dispatch({
        type: 'systemRegion/update',
        payload: {
          ...values,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('区域修改成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemRegion/add',
        payload: {
          ...values,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('区域添加成功。');
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
      xs: { offset: 0, span: 24 },
      sm: { offset: 5, span: 19 },
    },
  };

  return (
    <Form
      {...layout}
      form={form}
      name="regionForm"
      className="form"
      initialValues={{
        parentId: id && id.toString(),
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="编码" name="code" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="值" name="value">
        <Input />
      </Form.Item>
      <Form.Item label="父区域" name="parentId">
        <TreeSelect
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={tree}
          placeholder="请选择区域。"
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="描述" name="description" rules={[{ max: 255 }]}>
        <Input.TextArea placeholder="请输入区域描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
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

export default RegionForm;
