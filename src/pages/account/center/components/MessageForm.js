import React, { useEffect } from 'react';
import { Form, TreeSelect, Input, Switch, Radio, Button, message as Message } from 'antd';
import { connect } from 'umi';
import { difference, isEmpty } from '@/utils/utils';

const MessageForm = connect(({ user: { departmentTree, message }, loading }) => ({
  departmentTree,
  message,
  loading:
    loading.effects['user/fetchMessageById'] ||
    loading.effects['user/addMessage'] ||
    loading.effects['user/updateMessage'],
}))(({ loading, isEdit, id, departmentTree, message, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 初始化
  useEffect(() => {
    dispatch({
      type: 'user/fetchDepartmentTree',
      payload: {
        status: 1,
      },
    });
    return () => {
      dispatch({
        type: 'user/clearDepartmentTree',
      });
    };
  }, [dispatch]);

  // 【修改时，获取信息表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'user/fetchMessageById',
        payload: {
          id,
          source: 'INBOX',
        },
      });
    }
    return () => {
      dispatch({
        type: 'user/clearMessage',
      });
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显信息表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(message)) {
        setFieldsValue(message);
      }
    }
  }, [isEdit, message, setFieldsValue]);

  //
  const handleLoadData = (node) => {
    return new Promise((resolve) => {
      const { id: departmentId } = node;
      dispatch({
        type: 'user/fetchDepartmentUser',
        payload: {
          current: 1,
          pageSize: 1000,
          departmentId,
          status: 1,
        },
      });
      resolve();
    });
  };

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    let { receiveIdList } = values;
    // 分离出前缀，还原数据
    receiveIdList = receiveIdList.map((item) => item.split('_')[1]);
    if (isEdit) {
      const { receiveIdList: oldReceiveIdList } = message;
      const plusReceiveIds = difference(receiveIdList, oldReceiveIdList);
      const minusReceiveIds = difference(oldReceiveIdList, receiveIdList);
      dispatch({
        type: 'user/updateMessage',
        payload: {
          ...values,
          receiveIdList,
          id,
          plusReceiveIds,
          minusReceiveIds,
        },
        callback: () => {
          resetFields();
          closeModal();
          Message.success('修改信息成功。');
        },
      });
    } else {
      dispatch({
        type: 'user/addMessage',
        payload: {
          ...values,
          receiveIdList,
        },
        callback: () => {
          resetFields();
          closeModal();
          Message.success('添加信息成功。');
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
      name="messageForm"
      className="form"
      initialValues={{
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item
        label="收信人"
        name="receiveIdList"
        rules={[
          {
            required: true,
            message: '请选择收信人！',
          },
        ]}
      >
        <TreeSelect
          style={{ width: '100%' }}
          allowClear
          maxTagCount={5}
          maxTagPlaceholder="..."
          treeCheckable
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择"
          loadData={handleLoadData}
          treeData={departmentTree}
        />
      </Form.Item>
      <Form.Item
        label="标题"
        name="title"
        rules={[
          {
            required: true,
            message: '请将标题长度保持在1至128字符之间！',
            min: 1,
            max: 128,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="内容"
        name="content"
        rules={[{ message: '请将描述长度保持在1至255字符之间！', min: 1, max: 255 }]}
      >
        <Input.TextArea placeholder="请输入信息描述。" autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item>
      <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型！' }]}>
        <Radio.Group>
          <Radio value={1}>通知</Radio>
          <Radio value={2}>消息</Radio>
          <Radio value={3}>事件</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <Form.Item label="发布" name="isPublish" rules={[{ required: true, message: '请选择类型！' }]}>
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
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

export default MessageForm;
