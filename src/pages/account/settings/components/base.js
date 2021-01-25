import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ImgCrop from 'antd-img-crop';
import { isEmpty } from '@/utils/utils';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

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

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const BaseView = ({ currentUser, dispatch }) => {
  // 上传头像列表
  const [fileList, setFileList] = useState([]);
  // 上传头像名称
  const [avatar, setAvatar] = useState('');

  // 【回显头像】
  useEffect(() => {
    if (!isEmpty(currentUser)) {
      const { id, name, avatar: url } = currentUser;
      if (url) {
        setAvatar(url);
      }
      // 回显图片
      setFileList([
        {
          uid: id,
          name,
          status: 'done',
          url,
        },
      ]);
    }
  }, [currentUser]);

  // 【头像上传】
  const onChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === 'uploading') {
      return;
    }
    if (file.status === 'done') {
      setAvatar(file.response);
    }
  };
  // 【头像预览】
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
  // 【头像上传属性】
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

  // 【更新】
  const handleFinish = (values) => {
    dispatch({
      type: 'user/updateCurrentUser',
      payload: {
        ...currentUser,
        ...values,
        avatar,
      },
      callback: () => {
        message.success('更新基本信息成功。');
      },
    });
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form layout="vertical" onFinish={handleFinish} initialValues={currentUser} hideRequiredMark>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="signature" label="个性签名" rules={[{ required: true }]}>
            <Input placeholder="个性签名" />
          </Form.Item>
          <Form.Item name="profile" label="个人简介" rules={[{ required: true }]}>
            <Input.TextArea placeholder="个人简介" rows={4} />
          </Form.Item>
          <Form.Item name="phone" label="固定电话" rules={[{ required: true }, { validator: validatorPhone }]}>
            <PhoneView />
          </Form.Item>
          <Form.Item name="mobile" label="移动电话" rules={[{ required: true }, { validator: validatorPhone }]}>
            <PhoneView />
          </Form.Item>
          <Form.Item name="address" label="街道地址" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <ImgCrop rotate aspect={144 / 144}>
          <Upload {...fileProps}>{fileList.length < 1 && <UploadOutlined />}</Upload>
        </ImgCrop>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(BaseView);
