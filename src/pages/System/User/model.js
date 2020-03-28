import {
  getDepartmentTree,
  pageUser,
  addUser,
  getUserById,
  updateUser,
  enableUser,
  resetUserPassword,
  deleteUser,
  deleteBatchUser,
  listUserRole,
  grantUserRole,
} from './service';

export default {
  namespace: 'systemUser',

  state: {
    tree: [],
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    user: {},
    // 角色列表与已选角色
    roleTree: [],
    checkedKeys: [],
    halfCheckedKeys: [],
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
      const newList = list.map((item) => ({ ...item, status: !!item.status }));
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
      const pagination = yield select((state) => state.systemUser.pagination);
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
      const user = {
        ...response,
        status: !!response.status,
        departmentId: response.departmentId.toString(),
      };
      yield put({
        type: 'saveUser',
        payload: {
          user,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const { oldDepartmentId, ...rest } = payload;
      const params = { ...rest, status: +payload.status };
      yield call(updateUser, params);
      const pagination = yield select((state) => state.systemUser.pagination);
      const { current, pageSize } = pagination;
      yield put({
        type: 'fetch',
        payload: {
          departmentId: oldDepartmentId,
          current,
          pageSize,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status, departmentId } = payload;
      const params = { id, status: +status };
      yield call(enableUser, params);
      const pagination = yield select((state) => state.systemUser.pagination);
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
    *reset({ payload, callback }, { call }) {
      yield call(resetUserPassword, payload);
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id, departmentId } = payload;
      yield call(deleteUser, id);
      const pagination = yield select((state) => state.systemUser.pagination);
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
      const pagination = yield select((state) => state.systemUser.pagination);
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
    *fetchRoleTree({ payload, callback }, { call, put }) {
      const response = yield call(listUserRole, payload);
      const { roleList, roleSelectedList } = response;
      const selected = [];
      const halfSelected = [];
      roleSelectedList.forEach((item) => {
        if (item.rgt - item.lft === 1) {
          selected.push(item);
        } else {
          halfSelected.push(item);
        }
      });
      yield put({
        type: 'saveRoleTree',
        payload: {
          roleTree: roleList,
          checkedKeys: selected.map((item) => item.id.toString()),
          halfCheckedKeys: halfSelected.map((item) => item.id.toString()),
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
      const { user } = payload;
      return {
        ...state,
        user,
      };
    },
    clearUser(state) {
      return {
        ...state,
        user: {},
      };
    },
    saveRoleTree(state, { payload }) {
      const { roleTree, checkedKeys, halfCheckedKeys } = payload;
      return {
        ...state,
        roleTree,
        checkedKeys,
        halfCheckedKeys,
      };
    },
    clearRoleTree(state) {
      return {
        ...state,
        roleTree: [],
        checkedKeys: [],
        halfCheckedKeys: [],
      };
    },
  },
};
