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
    editDictionary: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageDict, payload);
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveList',
        payload: {
          list: list.map(item => ({ ...item, status: !!item.status })),
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(addDict, params);
      const pagination = yield select(state => state.systemDictionary.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          parentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getDictById, id);
      const editDictionary = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          editDictionary,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(updateDict, params);
      const pagination = yield select(state => state.systemDictionary.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          parentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, parentId, status } = payload;
      const params = { id, status: +status };
      yield call(enableDict, params);
      const pagination = yield select(state => state.systemDictionary.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          parentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id, parentId } = payload;
      yield call(deleteDict, id);
      const pagination = yield select(state => state.systemDictionary.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          parentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids, parentId } = payload;
      yield call(deleteBatchDict, ids);
      const pagination = yield select(state => state.systemDictionary.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          parentId,
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
    save(state, { payload }) {
      const { editDictionary } = payload;
      return {
        ...state,
        editDictionary,
      };
    },
    clear(state) {
      return {
        ...state,
        editDictionary: {},
      };
    },
  },
};
