import {
  getDepartmentTree,
  pageUser,
  addUser,
  getUserById,
  updateUser,
  enableUser,
  deleteUser,
  deleteBatchUser,
  listUserRole,
  grantUserRole,
} from '../service';

export default {
  namespace: 'systemUser',

  state: {
    tree: [],
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    editUser: {},
    // 角色列表与已选角色
    roleList: [],
    selectedRoleIdList: [],
  },

  effects: {
    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageUser, payload);
      const { list, pageNum: current, pageSize, total } = response;
      const newList = list.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list: newList,
          pagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const { departmentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(addUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      const { current, pageSize } = pagination;
      yield put({
        type: 'fetch',
        payload: {
          departmentId,
          current,
          pageSize,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getUserById, id);
      const editUser = { ...response, status: !!response.status };
      yield put({
        type: 'saveUser',
        payload: {
          editUser,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const { oldDepartmentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(updateUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          departmentId: oldDepartmentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status, departmentId } = payload;
      const params = { id, status: +status };
      yield call(enableUser, params);
      const pagination = yield select(state => state.systemUser.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          departmentId,
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id, departmentId } = payload;
      yield call(deleteUser, id);
      const pagination = yield select(state => state.systemUser.pagination);
      const { current, pageSize } = pagination;
      yield put({
        type: 'fetch',
        payload: {
          departmentId,
          current,
          pageSize,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids, departmentId } = payload;
      yield call(deleteBatchUser, ids);
      const pagination = yield select(state => state.systemUser.pagination);
      const { current, pageSize } = pagination;
      yield put({
        type: 'fetch',
        payload: {
          departmentId,
          current,
          pageSize,
        },
      });
      if (callback) callback();
    },
    *fetchUserRole({ payload, callback }, { call, put }) {
      const response = yield call(listUserRole, payload);
      const { roleList, roleSelectedList } = response;
      const newRoleSelected = roleSelectedList.map(item => item.id);
      yield put({
        type: 'saveUserRole',
        payload: {
          roleList,
          selectedRoleIdList: newRoleSelected,
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
    saveTree(state, { payload }) {
      const { tree } = payload;
      return {
        ...state,
        tree,
      };
    },
    clearTree(state) {
      return {
        ...state,
        tree: [],
      };
    },
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
    saveUser(state, { payload }) {
      const { editUser } = payload;
      return {
        ...state,
        editUser,
      };
    },
    clearUser(state) {
      return { ...state, editUser: {} };
    },
    saveUserRole(state, { payload }) {
      const { roleList, selectedRoleIdList } = payload;
      return {
        ...state,
        roleList,
        selectedRoleIdList,
      };
    },
    clearUserRole(state) {
      return { ...state, roleList: [], selectedRoleIdList: [] };
    },
  },
};
