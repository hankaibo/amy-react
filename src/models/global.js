import { disconnect } from '../services/message';
import { listDictionaryByCode } from '../services/user';

const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
    sexList: [],
  },

  effects: {
    *listDictionary({ payload, callback }, { call, put }) {
      const response = yield call(listDictionaryByCode, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveDictionary',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveDictionary(state, { payload }) {
      const { tree } = payload;
      return {
        ...state,
        tree,
      };
    },
  },

  subscriptions: {
    destroy({ history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user/login') {
          disconnect();
        }
      });
    },
  },
};

export default GlobalModel;
