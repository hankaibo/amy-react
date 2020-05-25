import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Radio, Upload, TreeSelect, Button, message } from 'antd';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';
import { UpOutlined, DownOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../../System.less';

// 【模拟上传图片相关函数】
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 【上传前控制判断】
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('对不起，只支持jpg与png格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('对不起，您上传的图片超过2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UserForm = connect(({ systemUser: { tree, user }, loading }) => ({
  tree,
  user,
  loading:
    loading.effects['systemUser/fetchById'] ||
    loading.effects['systemUser/add'] ||
    loading.effects['systemUser/update'],
}))(({ loading, visible, departmentId, isEdit, id, user, tree, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;

  // 【模拟图片上传的属性】
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  // 展开收缩
  const [expand, setExpand] = useState(false);

  // 【修改时，获取用户表单数据】
  useEffect(() => {
    if (visible && isEdit) {
      dispatch({
        type: 'systemUser/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemUser/clear',
      });
    };
  }, [visible, isEdit, id, dispatch]);

  // 【修改时，回显用户表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (!isEmpty(user)) {
        setFieldsValue(user);
      }
    }
  }, [visible, isEdit, user, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      dispatch({
        type: 'systemUser/update',
        payload: {
          ...values,
          id,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('修改用户成功。');
        },
      });
    } else {
      dispatch({
        type: 'systemUser/add',
        payload: {
          ...values,
        },
        callback: () => {
          resetFields();
          closeModal();
          message.success('添加用户成功。');
        },
      });
    }
  };

  // 【头像上传】
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 模拟一个url
      getBase64(info.file.originFileObj, (imgUrl) => {
        setImageUrl(imgUrl);
        setImageLoading(false);
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
  // 【上传按钮】
  const uploadButton = (
    <div>
      {imageLoading ? <UploadOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

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
          departmentId: departmentId && departmentId.toString(),
          status: true,
        }}
        onFinish={handleAddOrUpdate}
      >
        <Form.Item label="头像" name="avatar">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
          演示环境，不保存上传的图片。
        </Form.Item>
        <Form.Item
          label="名称"
          name="username"
          rules={[
            {
              required: true,
              message: '请将名称长度保持在1至20字符之间！',
              min: 1,
              max: 20,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请将密码长度保持在6至32字符之间！',
                min: 6,
                max: 32,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          label="所属部门"
          name="departmentId"
          rules={[{ required: true, message: '请选择一个部门！' }]}
        >
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
        <>
          <div style={{ display: expand ? 'block' : 'none' }}>
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ message: '请将昵称长度保持在1至20字符之间！', min: 1, max: 20 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="真实姓名"
              name="realName"
              rules={[{ message: '请将真实姓名长度保持在1至20字符之间！', min: 1, max: 20 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ type: 'email', message: '请输入正确的邮箱。' }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="座机号码"
              name="phone"
              rules={[{ message: '请将座机号码长度保持在8至20字符之间！', min: 8, max: 20 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机号码"
              name="mobile"
              rules={[{ message: '请将手机号码长度保持在8至20字符之间！', min: 8, max: 20 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="性别" name="sex">
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
                <Radio value={3}>保密</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item {...tailLayout}>
            <Button type="dashed" block onClick={() => setExpand(!expand)}>
              {expand ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </Form.Item>
        </>
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

export default UserForm;
