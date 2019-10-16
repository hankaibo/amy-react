import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, accountLogout, getCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
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
          if (window.routerBase !== '/') {
            redirect = redirect.replace(window.routerBase, '/');
          }
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
          if (redirect === '/user/login') {
            redirect = null;
          }
        } else {
          redirect = null;
        }
      }
      yield put(routerRedux.replace(redirect || '/app'));
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getCaptcha, payload);
    },

    *logout(_, { call, put }) {
      yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          data: {},
        },
      });
      reloadAuthorized();
      localStorage.clear();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.resources);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
