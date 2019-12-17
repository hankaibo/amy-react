import React, { Component } from 'react';

import { Form } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoginContext from './loginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';

class Login extends Component {
  getContext = () => {
    const { form } = this.props;
    return {
      form: {
        ...form,
      },
    };
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    if (form) {
      form.validateFields({ force: true }, (err, values) => {
        onSubmit(err, values);
      });
    }
  };

  render() {
    const { className, children } = this.props;
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>{children}</Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});
Login.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};
Login.defaultProps = {
  className: '',
  onSubmit: () => {},
};

export default Form.create()(Login);
