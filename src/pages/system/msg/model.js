import {
  pageMessage,
  addMessage,
  getMessageById,
  updateMessage,
  enableMessage,
  deleteMessage,
  deleteBatchMessage,
} from './service';

export default {
  namespace: 'systemMessage',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    msg: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageMessage, payload);
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
      const response = yield call(addMessage, params);
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
      const response = yield call(getMessageById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const msg = { ...response, status: !!response.status };
      yield put({
        type: 'saveMessage',
        payload: {
          msg,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(updateMessage, params);
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
      const response = yield call(enableMessage, params);
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
      const response = yield call(deleteMessage, id);
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
      const response = yield call(deleteBatchMessage, ids);
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
    saveMessage(state, { payload }) {
      const { msg } = payload;
      return {
        ...state,
        msg,
      };
    },
    clearMessage(state) {
      return {
        ...state,
        msg: {},
      };
    },
  },
};
