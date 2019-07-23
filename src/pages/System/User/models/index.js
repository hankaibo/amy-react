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
    // 编辑信息
    info: {},
    // 分配角色列表及选中+用户id
    userId: '',
    roleList: [],
    roleSelected: [],
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
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryUserById, id);
      const { data } = response;
      const info = { ...data, status: !!data.status };
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
      yield call(addUser, params);
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
      yield call(enabledUser, params);
      const oldList = yield select(state => state.systemUser.list);
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
    *fetchAllRole({ record, callback }, { call, put }) {
      const { id } = record;
      const response = yield call(queryRoleByUser, id);
      const {
        data: { roleList, roleSelected },
      } = response;
      yield put({
        type: 'saveRoleList',
        payload: {
          roleList,
          roleSelected: roleSelected.map(item => item.id),
          userId: id,
        },
      });
      if (callback) callback();
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
    saveInfo(state, { payload }) {
      const { info } = payload;
      return {
        ...state,
        info,
      };
    },
    updateList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    saveRoleList(state, { payload }) {
      const { roleList, roleSelected, userId } = payload;
      return {
        ...state,
        roleList,
        roleSelected,
        userId,
      };
    },
    clearInfo(state) {
      return {
        ...state,
        info: {},
      };
    },
    clearRole(state) {
      return {
        ...state,
        roleList: [],
        roleSelected: [],
        userId: '',
      };
    },
  },
};
