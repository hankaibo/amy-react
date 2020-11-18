import React, { useState } from 'react';
import { Form, Input, Button, Alert, Checkbox } from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const FormItem = Form.Item;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.login}>
      <Form
        form={props.from}
        onFinish={(values) => {
          handleSubmit(values);
        }}
      >
        {status === 'error' && !submitting && <LoginMessage content="账户或密码错误（user/123456）" />}
        <FormItem
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input
            size="large"
            placeholder="用户名: admin or user"
            prefix={<UserOutlined style={{ color: '#1890ff' }} className={styles.prefixIcon} />}
          />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="密码: 123456"
            prefix={<LockTwoTone className={styles.prefixIcon} />}
          />
        </FormItem>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a style={{ float: 'right' }}> 忘记密码 </a>
        </div>
        <FormItem>
          <Button className={styles.submit} size="large" type="primary" htmlType="submit" loading={submitting}>
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
