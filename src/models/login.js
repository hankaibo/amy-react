import router from 'umi/router';
import { stringify } from 'qs';
import { login, logout } from '@/services/login';

import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';

const Model = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      // 此处不可以请求用户信息（包括当前登录用户个人信息及菜单）请求，原因请看BasicLayout.js L 51。
      const { token, resources } = response;
      localStorage.setItem('jwt', token);
      reloadAuthorized(resources);
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = '/';
          return;
        }
      }
      router.replace(redirect || '/');
    },

    *logout(_, { call }) {
      yield call(logout);
      reloadAuthorized();
      localStorage.clear();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.resources);
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
