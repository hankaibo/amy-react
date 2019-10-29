import {
  pageInformation,
  addInformation,
  getInformationById,
  updateInformation,
  deleteInformation,
  deleteBatchInformation,
} from '../service';

export default {
  namespace: 'systemInformation',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    editInformation: {},
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageInformation, payload);
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveList',
        payload: {
          list,
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    * add({ payload, callback }, { call, put, select }) {
      yield call(addInformation, payload);
      const pagination = yield select(state => state.systemInformation.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    * fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getInformationById, id);
      yield put({
        type: 'saveInformation',
        payload: {
          editInformation: response,
        },
      });
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put, select }) {
      yield call(updateInformation, payload);
      const pagination = yield select(state => state.systemInformation.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    * delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      yield call(deleteInformation, id);
      const pagination = yield select(state => state.systemInformation.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    * deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids } = payload;
      yield call(deleteBatchInformation, ids);
      const pagination = yield select(state => state.systemInformation.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
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
      const { editInformation } = payload;
      return {
        ...state,
        editInformation,
      };
    },
    clearInformation(state) {
      return {
        ...state,
        editInformation: {},
      };
    },
  },
};
