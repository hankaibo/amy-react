import { addDict, deleteBatchDict, deleteDict, enableDict, getDictById, pageDict, updateDict } from './service';

export default {
  namespace: 'systemDictionary',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    dictionary: {},
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(pageDict, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveList',
        payload: {
          list: list.map((item) => ({ ...item, status: item.status === 'ENABLED' })),
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(addDict, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionary.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
          current: 1,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getDictById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const dictionary = { ...response, status: response.status === 'ENABLED' };
      yield put({
        type: 'save',
        payload: {
          dictionary,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(updateDict, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionary.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(enableDict, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionary.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteDict, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionary.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids } = payload;
      const response = yield call(deleteBatchDict, ids);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionary.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
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
    saveList(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination,
      };
    },
    clearList(state) {
      return {
        ...state,
        list: [],
        pagination: {},
        filter: {},
      };
    },
    save(state, { payload }) {
      const { dictionary } = payload;
      return {
        ...state,
        dictionary,
      };
    },
    clear(state) {
      return {
        ...state,
        dictionary: {},
      };
    },
  },
};
