import {
  queryUserList,
  queryUserById,
  addUser,
  deleteUser,
  deleteBatchUser,
  updateUser,
  enabledUser,
  queryRoleByUser,
  giveUserRole,
} from '../service';

export default {
  namespace: 'systemUser',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      const { list, pageNum: current, pageSize, total } = response.data;
      const newList = list.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list: newList,
          pagination: { current, pageSize, total },
        },
      });
    },
    *fetchById({ payload, callback }, { call }) {
      const { id } = payload;
      const response = yield call(queryUserById, id);
      const { data } = response;
      if (callback) callback();
      return { ...data, status: !!data.status };
    },
    *add({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(addUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      yield call(deleteUser, id);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids } = payload;
      yield call(deleteBatchUser, ids);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      yield call(enabledUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchRoleList({ payload, callback }, { call }) {
      const { id } = payload;
      const response = yield call(queryRoleByUser, id);
      const {
        data: { roleList, roleSelected },
      } = response;
      if (callback) callback();
      return { roleList, roleSelected: roleSelected.map(item => item.id) };
    },
    *giveUserRole({ payload, callback }, { call }) {
      yield call(giveUserRole, payload);
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
  },
};
