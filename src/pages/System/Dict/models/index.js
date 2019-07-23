import {
  queryDictList,
  queryDictById,
  addDict,
  deleteDict,
  deleteBatchDict,
  updateDict,
  enabledDict,
} from '../service';

export default {
  namespace: 'systemDictionary',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    info: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDictList, payload);
      const { list, pageNum: current, pageSize, total } = response.data;
      yield put({
        type: 'saveList',
        payload: {
          list: list.map(item => ({ ...item, state: !!item.state })),
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryDictById, id);
      const { data } = response;
      const info = { ...data, state: !!data.state };
      yield put({
        type: 'saveInfo',
        payload: {
          info,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const params = { ...payload, status: +payload.status };
      yield call(addDict, params);
      if (callback) callback();
    },
    *delete({ id, callback }, { call }) {
      yield call(deleteDict, id);
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchDict, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: payload.status };
      yield call(updateDict, params);
      const oldList = yield select(state => state.systemDictionary.list);
      const newList = oldList.map(item => {
        if (item.id === payload.id) return { ...item, ...payload };
        return item;
      });
      yield put({
        type: 'updateList',
        payload: {
          list: newList,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      yield call(enabledDict, params);
      const oldList = yield select(state => state.systemDictionary.list);
      const newList = oldList.map(item => {
        if (item.id === id) return { ...item, status };
        return item;
      });
      yield put({
        type: 'updateList',
        payload: {
          list: newList,
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
    saveInfo(state, { payload }) {
      const { info } = payload;
      return {
        ...state,
        info,
      };
    },
    clearInfo(state) {
      return {
        ...state,
        info: {},
      };
    },
    updateList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
  },
};
