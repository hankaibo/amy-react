import React, { useState, useEffect } from 'react';
import { Redirect, connect, history } from 'umi';
import { stringify } from 'qs';
import { PageLoading } from '@ant-design/pro-layout';
import { getItem } from '@/utils/utils';

const SecurityLayout = ({ loading, children, currentUser, dispatch }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    // 首先判断是否有token，有则尝试直接进入；否则进入登录页面。
    if (getItem('jwt')) {
      dispatch({
        type: 'user/fetchCurrentUser',
      });
    } else {
      history.push('/user/login');
    }
  }, [dispatch]);

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
};

export default connect(({ user: { currentUser }, loading }) => ({
  currentUser,
  loading: loading.effects['user/fetchCurrentUser'],
}))(SecurityLayout);
