import React, { useEffect } from 'react';
import { Form, Input, Modal, message, Button, Radio } from 'antd';
import { connect } from 'umi';
import styles from '../../System.less';

const InformationForm = connect(({ systemInformation: { information }, loading }) => ({
  information,
  loading:
    loading.effects['systemInformation/fetchById'] ||
    loading.effects['systemInformation/add'] ||
    loading.effects['systemInformation/update'],
}))(({ loading, visible, isEdit, id, searchParams, information, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【修改时，获取信息表单数据】
  useEffect(() => {
    if (visible && isEdit) {
      dispatch({
        type: 'systemInformation/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemInformation/clearInformation',
      });
    };
  }, [visible, isEdit, id, dispatch]);

  // 【修改时，回显信息表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (Object.keys(information).length > 0) {
        setFieldsValue(information);
      }
    }
  }, [visible, isEdit, information, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      Object.assign(values, { id });
      dispatch({
        type: 'systemInformation/update',
        payload: {
          values,
          searchParams,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('修改信息成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemInformation/add',
        payload: {
          values,
          searchParams,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('添加信息成功。');
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
    <Modal
      destroyOnClose
      title={isEdit ? '修改' : '新增'}
      visible={visible}
      onCancel={closeModal}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        name="userForm"
        className={styles.form}
        initialValues={{
          status: true,
        }}
        onFinish={handleAddOrUpdate}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: '请将标题长度保持在1至20字符之间！',
              min: 1,
              max: 20,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ message: '请将描述长度保持在1至150字符之间！', min: 1, max: 150 }]}
        >
          <Input.TextArea placeholder="请输入信息描述。" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型！' }]}>
          <Radio.Group>
            <Radio value={1}>通知</Radio>
            <Radio value={2}>消息</Radio>
            <Radio value={3}>事件</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="发送范围"
          name="range"
          rules={[{ required: true, message: '请选择范围！' }]}
        >
          <Radio.Group>
            <Radio value={1}>按部门</Radio>
            <Radio value={2}>按用户</Radio>
            <Radio value={3}>自定义</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button onClick={closeModal}>取消</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default InformationForm;
