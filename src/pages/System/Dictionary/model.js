import {
  pageDict,
  addDict,
  getDictById,
  updateDict,
  enableDict,
  deleteDict,
  deleteBatchDict,
} from './service';

export default {
  namespace: 'systemDictionary',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    dictionary: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageDict, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveList',
        payload: {
          list: list.map((item) => ({ ...item, status: !!item.status })),
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(addDict, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetch',
        payload: {
          ...searchParams,
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
      const dictionary = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          dictionary,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(updateDict, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetch',
        payload: {
          ...searchParams,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, searchParams } = payload;
      const params = { id, status: +status };
      const response = yield call(enableDict, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetch',
        payload: {
          ...searchParams,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, searchParams } = payload;
      const response = yield call(deleteDict, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetch',
        payload: {
          ...searchParams,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put }) {
      const { ids, searchParams } = payload;
      const response = yield call(deleteBatchDict, ids);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetch',
        payload: {
          ...searchParams,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
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
