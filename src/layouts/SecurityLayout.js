import React from 'react';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { PageLoading } from '@ant-design/pro-layout';
import { getAuthority } from '@/utils/authority';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = getAuthority();
    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default SecurityLayout;
