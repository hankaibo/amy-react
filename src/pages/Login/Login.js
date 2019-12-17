import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Checkbox } from 'antd';
import { connect } from 'dva';
import LoginComponents from './components';
import styles from './Login.less';

const { Username, Password, Submit } = LoginComponents;

class Login extends Component {
  state = {
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  render() {
    const { submitting } = this.props;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Username
            name="username"
            placeholder={`${formatMessage({ id: 'app.login.username' })}: admin or user`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.username.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'app.login.password' })}: 123456`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          <div>
            <Checkbox
              checked={autoLogin}
              onChange={this.changeAutoLogin}
              style={{ color: 'white' }}
            >
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))(Login);
