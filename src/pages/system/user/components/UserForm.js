import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Radio, Upload, TreeSelect, Button, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { connect } from 'umi';
import { difference, isEmpty } from '@/utils/utils';
import { UpOutlined, DownOutlined, UploadOutlined } from '@ant-design/icons';

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
}))(({ loading, departmentId, isEdit, id, user, tree, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;

  // 展开收缩
  const [expand, setExpand] = useState(false);
  // 上传文件列表
  const [fileList, setFileList] = useState([]);

  // 【修改时，获取用户表单数据】
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'systemUser/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      if (isEdit) {
        dispatch({
          type: 'systemUser/clear',
        });
      }
    };
  }, [isEdit, id, dispatch]);

  // 【修改时，回显用户表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (isEdit) {
      if (!isEmpty(user)) {
        setFieldsValue(user);
        // 回显图片
        setFileList([
          {
            uid: user.id,
            name: user.name,
            status: 'done',
            url: user.avatar,
          },
        ]);
      }
    }
  }, [isEdit, user, setFieldsValue]);

  // 【添加与修改】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      const { departmentIdList } = values;
      const { departmentIdList: oldDepartmentIdList } = user;
      const plusDepartmentIds = difference(departmentIdList, oldDepartmentIdList);
      const minusDepartmentIds = difference(oldDepartmentIdList, departmentIdList);
      dispatch({
        type: 'systemUser/update',
        payload: {
          ...values,
          id,
          plusDepartmentIds,
          minusDepartmentIds,
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
  const onChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === 'uploading') {
      return;
    }
    if (file.status === 'done') {
      setFieldsValue({ avatar: file.response });
    }
  };
  // 【图片预览】
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  // 【上传属性】
  const fileProps = {
    action: '/api/v1/users/upload',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    listType: 'picture-card',
    fileList,
    beforeUpload,
    onChange,
    onPreview,
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
      name="userForm"
      className="form"
      initialValues={{
        departmentIdList: departmentId && [departmentId.toString()],
        status: true,
      }}
      onFinish={handleAddOrUpdate}
    >
      <Form.Item label="头像" name="avatar">
        <ImgCrop rotate aspect={104 / 104}>
          <Upload {...fileProps}>{fileList.length < 1 && <UploadOutlined />}</Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item label="名称" name="username" rules={[{ required: true }, { max: 255 }]}>
        <Input />
      </Form.Item>
      {!isEdit && (
        <Form.Item label="密码" name="password" rules={[{ required: true }, { min: 6, max: 32 }]}>
          <Input.Password />
        </Form.Item>
      )}
      <Form.Item label="所属部门" name="departmentIdList" rules={[{ required: true }]}>
        <TreeSelect
          showSearch
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={tree}
          allowClear
          multiple
          placeholder="请选择部门。"
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]} valuePropName="checked">
        <Switch checkedChildren="开" unCheckedChildren="关" />
      </Form.Item>
      <>
        <div style={{ display: expand ? 'block' : 'none' }}>
          <Form.Item label="昵称" name="nickname" rules={[{ max: 32 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="真实姓名" name="realName" rules={[{ max: 255 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="座机号码" name="phone" rules={[{ max: 32 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号码" name="mobile" rules={[{ max: 32 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="性别" name="sex">
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
              <Radio value={0}>保密</Radio>
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
  );
});

export default UserForm;
