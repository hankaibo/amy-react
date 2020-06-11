import React, { useRef } from 'react';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更改头像
        </Button>
      </div>
    </Upload>
  </>
);
const validatorGeographic = (_, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
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

const BaseView = ({ currentUser }) => {
  const viewRef = useRef(undefined);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }
    return '';
  };

  const handleFinish = () => {
    message.success('更新基本信息成功v');
  };

  return (
    <div className={styles.baseView} ref={viewRef}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={currentUser}
          hideRequiredMark
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请输入您的邮箱!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="profile"
            label="个人简介"
            rules={[
              {
                required: true,
                message: '请输入个人简介!',
              },
            ]}
          >
            <Input.TextArea placeholder="个人简介" rows={4} />
          </Form.Item>
          <Form.Item
            name="country"
            label="国家/地区"
            rules={[
              {
                required: true,
                message: '请输入您的国家或地区!',
              },
            ]}
          >
            <Select style={{ maxWidth: 220 }}>
              <Option value="China">中国</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="geographic"
            label="所在省市"
            rules={[
              {
                required: true,
                message: '请输入您的所在省市!',
              },
              {
                validator: validatorGeographic,
              },
            ]}
          >
            <GeographicView />
          </Form.Item>
          <Form.Item
            name="address"
            label="街道地址"
            rules={[
              {
                required: true,
                message: '请输入您的街道地址!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              {
                required: true,
                message: '请输入您的联系电话!',
              },
              { validator: validatorPhone },
            ]}
          >
            <PhoneView />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(BaseView);
