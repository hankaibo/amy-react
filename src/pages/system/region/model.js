import {
  addRegion,
  deleteRegion,
  enableRegion,
  getRegionById,
  getRegionTree,
  listSubRegionById,
  moveRegion,
  updateRegion,
} from './service';

export default {
  namespace: 'systemRegion',

  state: {
    // 树
    tree: [],
    // 列表
    list: [],
    // 编辑
    region: {},
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getRegionTree, payload);
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
      const response = yield call(listSubRegionById, payload);
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
      const response = yield call(addRegion, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRegion.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getRegionById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const region = { ...response, status: response.status === 'ENABLED', parentId: `${response.parentId}` };
      yield put({
        type: 'save',
        payload: {
          region,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(updateRegion, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRegion.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(enableRegion, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRegion.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteRegion, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRegion.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put, select }) {
      const response = yield call(moveRegion, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRegion.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
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
      const { region } = payload;
      return {
        ...state,
        region,
      };
    },
    clear(state) {
      return {
        ...state,
        region: {},
      };
    },
  },
};
