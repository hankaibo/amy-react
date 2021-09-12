import {
  pageDictionaryItem,
  addDictionaryItem,
  getDictionaryItemById,
  updateDictionaryItem,
  enableDictionaryItem,
  deleteDictionaryItem,
  deleteBatchDictionaryItem,
} from '../services/dictionaryItem';

export default {
  namespace: 'systemDictionaryItem',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    dictionaryItem: {},
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
      const response = yield call(pageDictionaryItem, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { list, pageNum: current, pageSize, total } = response;
      const newList = list.map((item) => ({ ...item, status: item.status === 'ENABLED' }));
      yield put({
        type: 'saveList',
        payload: {
          list: newList,
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(addDictionaryItem, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionaryItem.filter);
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
      const response = yield call(getDictionaryItemById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const dictionaryItem = {
        ...response,
        status: response.status === 'ENABLED',
      };
      yield put({
        type: 'save',
        payload: {
          dictionaryItem,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(updateDictionaryItem, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionaryItem.filter);
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
      const response = yield call(enableDictionaryItem, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionaryItem.filter);
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
      const response = yield call(deleteDictionaryItem, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionaryItem.filter);
      yield put({
        type: 'fetch',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const response = yield call(deleteBatchDictionaryItem, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDictionaryItem.filter);
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
      const { dictionaryItem } = payload;
      return {
        ...state,
        dictionaryItem,
      };
    },
    clear(state) {
      return {
        ...state,
        dictionaryItem: {},
      };
    },
  },
};
