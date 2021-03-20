import {
  getMenuTree,
  listChildrenById,
  addMenu,
  getMenuById,
  updateMenu,
  enableMenu,
  deleteMenu,
  moveMenu,
} from './service';

export default {
  namespace: 'systemMenu',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑
    menu: {},
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(listChildrenById, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const list = response.map((item) => ({ ...item, status: item.status === 'ENABLED' }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(addMenu, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemMenu.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: values.type,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getMenuById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const menu = { ...response, status: response.status === 'ENABLED' };
      yield put({
        type: 'save',
        payload: {
          menu,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(updateMenu, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemMenu.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: values.type,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const values = { id, status: status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(enableMenu, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemMenu.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: filter.type,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteMenu, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemMenu.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: filter.type,
        },
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put, select }) {
      const response = yield call(moveMenu, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemMenu.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: filter.type,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveFilter(state, { payload }) {
      return {
        ...state,
        filter: {
          ...payload,
        },
      };
    },
    saveTree(state, { payload }) {
      const { tree } = payload;
      return {
        ...state,
        tree,
      };
    },
    clearTree(state) {
      return {
        ...state,
        tree: [],
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    clearList(state) {
      return {
        ...state,
        list: [],
        filter: {},
      };
    },
    save(state, { payload }) {
      const { menu } = payload;
      return {
        ...state,
        menu,
      };
    },
    clear(state) {
      return {
        ...state,
        menu: {},
      };
    },
  },
};
