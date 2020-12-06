import React, { useEffect } from 'react';
import { Form, Input, Switch, TreeSelect, Button, message } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';

const RoleForm = connect(({ systemRole: { tree, role }, loading }) => ({
  tree,
  role,
  loading:
    loading.effects['systemRole/fetchById'] ||
    loading.effects['systemRole/add'] ||
    loading.effects['systemRole/update'],
}))(({ loading, isEdit, id, role, tree, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【修改时，获取角色表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemRole/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemRole/clear',
      });
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显角色表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(role)) {
        const formData = { ...role, parentId: role.parentId.toString() };
        setFieldsValue(formData);
      }
    }
  }, [isEdit, role, setFieldsValue]);

  // 【添加与修改角色】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      dispatch({
        type: 'systemRole/update',
        payload: {
          ...values,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('角色修改成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemRole/add',
        payload: {
          ...values,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('角色添加成功。');
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
      name="roleForm"
      className="form"
      initialValues={{
        parentId: id.toString(),
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item
        label="名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请将名称长度保持在1至255字符之间！',
            min: 1,
            max: 255,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="父角色" name="parentId" rules={[{ required: false, message: '请选择一个父角色！' }]}>
        <TreeSelect
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={tree}
          placeholder="请选择角色。"
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item
        label="编码"
        name="code"
        rules={[
          {
            required: true,
            message: '请将编码长度保持在1至255字符之间！',
            min: 1,
            max: 255,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="描述" name="description" rules={[{ message: '描述长度最大至255字符！', min: 1, max: 255 }]}>
        <Input.TextArea placeholder="请输入角色描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
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

export default RoleForm;
