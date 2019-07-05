import {
  queryUserList,
  queryUserById,
  addUser,
  deleteUser,
  deleteBatchUser,
  updateUser,
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
      const user = { ...data, state: !!data.state };
      delete user.createUser;
      delete user.createTime;
      delete user.modifyUser;
      delete user.modifyTime;
      delete user.salt;
      delete user.resourceList;
      delete user.roleList;
      delete user.lastLoginTime;
      yield put({
        type: 'selected',
        payload: user,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const data = { ...payload, state: Number(payload.state) };
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
    *update({ payload, callback }, { call, put }) {
      const data = { ...payload, state: Number(payload.state) };
      yield call(updateUser, data);
      const response = yield call(queryUserById, payload.id);
      yield put({
        type: 'updateList',
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
    updateList(state, { payload }) {
      const { list } = state;
      const newList = list.map(item => (item.id === payload.id ? { ...payload } : item));
      return {
        ...state,
        list: newList,
      };
    },
  },
};
