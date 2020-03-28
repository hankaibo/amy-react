import React, { useState, useEffect } from 'react';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import { PageLoading } from '@ant-design/pro-layout';

const SecurityLayout = connect(({ user: { currentUser }, loading }) => ({
  currentUser,
  loading: loading.models.user,
}))(({ loading, children, currentUser, dispatch }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    dispatch({
      type: 'user/fetchCurrent',
    });
  }, []);

  // You can replace it to your authentication rule (such as check token exists)
  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
  const isLogin = currentUser && currentUser.id;
  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && loading) || !isReady) {
    return <PageLoading />;
  }
  if (!isLogin && window.location.pathname !== '/user/login') {
    return <Redirect to={`/user/login?${queryString}`} />;
  }
  return children;
});

export default SecurityLayout;
