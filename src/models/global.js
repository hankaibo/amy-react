import { disconnect } from '../services/message';

const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {},

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
      return {
        ...state,
        collapsed: payload,
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
