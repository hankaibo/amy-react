import { history } from 'umi';
import { stringify } from 'qs';
import { login, logout } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { connect } from '@/services/message';

const Model = {
  namespace: 'login',

  state: {
    status: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // Login successfully
      // 判断请求成功的方法有很多，请结合后台接口判断。
      // 比如，后台数据统一封装成{code:200, message:'OK', data:Object|Array }，那你的判断就是response.code===200;
      // 当然，也有的后台接口，数据直接返回无封装，像这样{token:token,resources:['a','b']]，但请求失败是统一的格式，就可以使用请求失败的格式进行判断。
      // 在这里，我的接口，请求成功时直接返回一堆数据；请求失败时统一封装错误信息返回。
      const { apierror } = response;
      if (apierror) {
        const { status } = apierror;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status,
          },
        });
        return;
      }
      const { token, resources } = response;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          resources,
        },
      });
      localStorage.setItem('jwt', token);
      // 初始化websocket
      connect();
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
          window.location.href = '/';
          return;
        }
      }
      history.replace(redirect || '/');
    },

    *logout(_, { call, put }) {
      yield call(logout);
      localStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: '',
        },
      });
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
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
      const { status = 'ok', resources = [] } = payload;
      setAuthority(resources);
      return {
        ...state,
        status,
      };
    },
  },
};

export default Model;
