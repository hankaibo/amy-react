import {
  pageInformation,
  addInformation,
  getInformationById,
  updateInformation,
  enableInformation,
  deleteInformation,
  deleteBatchInformation,
} from './service';

export default {
  namespace: 'systemInformation',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    information: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageInformation, payload);
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
      const response = yield call(addInformation, params);
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
      const response = yield call(getInformationById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const information = { ...response, status: !!response.status };
      yield put({
        type: 'saveInformation',
        payload: {
          information,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(updateInformation, params);
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
      const response = yield call(enableInformation, params);
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
      const response = yield call(deleteInformation, id);
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
      const response = yield call(deleteBatchInformation, ids);
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
    saveInformation(state, { payload }) {
      const { information } = payload;
      return {
        ...state,
        information,
      };
    },
    clearInformation(state) {
      return {
        ...state,
        information: {},
      };
    },
  },
};
