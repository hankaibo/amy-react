import {
  pageUser,
  getUserById,
  addUser,
  deleteUser,
  deleteBatchUser,
  updateUser,
  enableUser,
  listRoleByUser,
  grantUserRole,
} from '../service';

export default {
  namespace: 'systemUser',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    editUser: {},
    // 角色列表与已选角色
    roleList: [],
    roleSelected: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(pageUser, payload);
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
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getUserById, id);
      const { data } = response;
      const editUser = { ...data, status: !!data.status };
      yield put({
        type: 'saveUser',
        payload: {
          editUser,
        },
      });
      if (callback) callback();
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
      yield call(enableUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchRoleByUser({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(listRoleByUser, id);
      const {
        data: { roleList, roleSelected },
      } = response;
      const newRoleSelected = roleSelected.map(item => item.id);
      yield put({
        type: 'saveRole',
        payload: {
          roleList,
          roleSelected: newRoleSelected,
        },
      });
      if (callback) callback();
    },
    *grantUserRole({ payload, callback }, { call }) {
      yield call(grantUserRole, payload);
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
    saveUser(state, { payload }) {
      const { editUser } = payload;
      return {
        ...state,
        editUser,
      };
    },
    saveRole(state, { payload }) {
      const { roleList, roleSelected } = payload;
      return {
        ...state,
        roleList,
        roleSelected,
      };
    },
  },
};
