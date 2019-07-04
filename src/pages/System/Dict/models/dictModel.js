import {
  queryDictList,
  queryDictOneById,
  addDict,
  removeDict,
  removeBatchDict,
  updateDict,
} from '../dictService';

export default {
  namespace: 'dictionary',

  state: {
    list: [],
    pagination: {},
    selected: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDictList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchOneById({ id, callback }, { call, put }) {
      const response = yield call(queryDictOneById, id);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const data = { ...payload, state: Number(payload.state) };
      yield call(addDict, data);
      if (callback) callback();
    },
    *remove({ id, callback }, { call }) {
      yield call(removeDict, id);
      if (callback) callback();
    },
    *removeBatch({ payload, callback }, { call }) {
      const { ids } = payload;
      yield call(removeBatchDict, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const data = { ...payload, state: Number(payload.state) };
      yield call(updateDict, data);
      yield put({
        type: 'updateState',
        payload: data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveList(state, action) {
      const { payload } = action;
      const { list: data, pageNum: current, pageSize, total } = payload;
      const list = data.map(item => ({ ...item, state: !!item.state }));
      return {
        ...state,
        list,
        pagination: {
          current,
          pageSize,
          total,
        },
      };
    },
    saveOne(state, action) {
      const { payload } = action;
      const data = { ...payload, state: !!payload.state };
      delete data.createUser;
      delete data.createTime;
      delete data.modifyUser;
      delete data.modifyTime;
      return {
        ...state,
        selected: data,
      };
    },
    clearOne(state) {
      return {
        ...state,
        selected: {},
      };
    },
    updateState(state, action) {
      const { list } = state;
      const { payload } = action;
      const newList = list.map(item => {
        if (item.id === payload.id) {
          return { ...item, state: !!payload.state };
        }
        return item;
      });
      return {
        ...state,
        list: newList,
      };
    },
  },
};
