import React, { useEffect } from 'react';
import { Form, Input, Switch, TreeSelect, Button, message } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';

const DepartmentForm = connect(({ systemDepartment: { tree, department }, loading }) => ({
  tree,
  department,
  // 数组写多个无效，直接使用model又不够细粒度。
  loading:
    loading.effects['systemDepartment/fetchById'] ||
    loading.effects['systemDepartment/add'] ||
    loading.effects['systemDepartment/update'],
}))(({ loading, isEdit, id, department, tree, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【修改时，获取部门表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemDepartment/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      if (isEdit) {
        dispatch({
          type: 'systemDepartment/clear',
        });
      }
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显部门表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(department)) {
        setFieldsValue(department);
      }
    }
  }, [isEdit, department, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      dispatch({
        type: 'systemDepartment/update',
        payload: {
          ...values,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('部门修改成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemDepartment/add',
        payload: {
          ...values,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('部门添加成功。');
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
      name="departmentForm"
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
      <Form.Item label="父部门" name="parentId" rules={[{ required: true }]}>
        <TreeSelect
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={tree}
          placeholder="请选择部门。"
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="描述" name="description" rules={[{ max: 255 }]}>
        <Input.TextArea placeholder="请输入部门描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
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

export default DepartmentForm;
