import { disconnect } from '@/services/message';
import { listDictionaryItemByCode } from '@/services/user';

const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {
    *listDictionaryItem({ payload, callback }, { call, put }) {
      const { code } = payload;
      const response = yield call(listDictionaryItemByCode, code);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveDictionaryItem',
        payload: {
          [code]: response.list,
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
    saveDictionaryItem(state, { payload }) {
      return {
        ...state,
        ...payload,
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
