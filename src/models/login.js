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
      if (response.code === 200) {
        const {
          data: { token, role },
        } = response;
        localStorage.setItem('jwt', token);
        reloadAuthorized(role);
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
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getCaptcha, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          data: {},
        },
      });
      if (response.code === 200) {
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
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.role);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
