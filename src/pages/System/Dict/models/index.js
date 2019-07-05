import {
  queryDictList,
  queryDictOneById,
  addDict,
  deleteDict,
  deleteBatchDict,
  updateDict,
} from '../service';

export default {
  namespace: 'systemDictionary',

  state: {
    list: [],
    pagination: {},
    selected: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDictList, payload);
      const { list, pageNum: current, pageSize, total } = response.data;
      yield put({
        type: 'saveList',
        payload: {
          list: list.map(item => ({ ...item, state: !!item.state })),
          pagination: {
            current,
            pageSize,
            total,
          },
        },
      });
      if (callback) callback();
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryDictOneById, id);
      const { data } = response;
      const dictionary = { ...data, state: !!data.state };
      delete dictionary.createUser;
      delete dictionary.createTime;
      delete dictionary.modifyUser;
      delete dictionary.modifyTime;
      yield put({
        type: 'selected',
        payload: dictionary,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const data = { ...payload, state: Number(payload.state) };
      yield call(addDict, data);
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
    *update({ payload, callback }, { call, put }) {
      const data = { ...payload, state: Number(payload.state) };
      yield call(updateDict, data);
      const response = yield call(queryDictOneById, data.id);
      yield put({
        type: 'updateState',
        payload: response.data,
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
    selected(state, { payload }) {
      return {
        ...state,
        selected: payload,
      };
    },
    clearSelected(state) {
      return {
        ...state,
        selected: {},
      };
    },
    updateState(state, { payload }) {
      const { list } = state;
      const newList = list.map(item => {
        if (item.id === payload.id) {
          return { ...payload, state: !!payload.state };
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
