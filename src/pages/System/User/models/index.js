import {
  queryUserList,
  queryUserById,
  addUser,
  deleteUser,
  deleteBatchUser,
  updateUser,
  enabledUser,
} from '../service';

export default {
  namespace: 'systemUser',

  state: {
    list: [],
    pagination: {},
    selected: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      const { list, pageNum: current, pageSize, total } = response.data;
      yield put({
        type: 'saveList',
        payload: {
          list,
          pagination: { current, pageSize, total },
        },
      });
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryUserById, id);
      const { data } = response;
      const user = { ...data, status: !!data.status };
      yield put({
        type: 'selected',
        payload: user,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const data = { ...payload, status: +payload.status };
      yield call(addUser, data);
      if (callback) callback();
    },
    *delete({ id, callback }, { call }) {
      yield call(deleteUser, id);
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchUser, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateUser, params);
      const oldList = yield select(state => state.systemUser.list);
      const newList = oldList.map(item => {
        if (item.id === payload.id) return { ...item, ...payload };
        return { ...item, status: !!item.status };
      });
      yield put({
        type: 'updateList',
        payload: newList,
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      yield call(enabledUser, params);
      const oldList = yield select(state => state.systemUser.list);
      const newList = oldList.map(item => {
        if (item.id === id) return { ...item, status };
        return { ...item, status: !!item.status };
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
    selected(state, { payload }) {
      return {
        ...state,
        selected: payload,
      };
    },
    unselected(state) {
      return {
        ...state,
        selected: {},
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
