import {
  pageRole,
  addRole,
  getRoleById,
  updateRole,
  enableRole,
  deleteRole,
  deleteBatchRole,
  getResourceByRole,
  grantRoleResource,
} from '../service';

export default {
  namespace: 'systemRole',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 编辑
    editRole: {},
    // 资源树、选中的Keys、半联动的keys
    tree: [],
    checkedKeys: [],
    halfCheckedKeys: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(pageRole, payload);
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
      const params = { ...payload, status: +payload.status };
      yield call(addRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getRoleById, id);
      const editRole = { ...response, status: !!response.status };
      yield put({
        type: 'saveRole',
        payload: {
          editRole,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      delete pagination.total;
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
      yield call(enableRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      delete pagination.total;
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
      yield call(deleteRole, id);
      const pagination = yield select(state => state.systemRole.pagination);
      delete pagination.total;
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
      yield call(deleteBatchRole, ids);
      const pagination = yield select(state => state.systemRole.pagination);
      delete pagination.total;
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchResTree({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getResourceByRole, id);
      const { resTree, resSelected } = response;
      const selected = [];
      const halfSelected = [];
      // 分离出半联动的父节点
      resSelected.forEach(item => {
        if (item.rgt - item.lft === 1) {
          selected.push(item);
        } else {
          halfSelected.push(item);
        }
      });
      yield put({
        type: 'saveResTree',
        payload: {
          tree: resTree,
          checkedKeys: selected.map(item => item.id.toString()),
          halfCheckedKeys: halfSelected.map(item => item.id.toString()),
        },
      });
      if (callback) callback();
    },
    *grantRoleResource({ payload, callback }, { call }) {
      yield call(grantRoleResource, payload);
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
    clearList(state) {
      return {
        ...state,
        list: [],
        pagination: {},
      };
    },
    saveRole(state, { payload }) {
      const { editRole } = payload;
      return {
        ...state,
        editRole,
      };
    },
    clearRole(state) {
      return {
        ...state,
        editRole: {},
      };
    },
    saveResTree(state, { payload }) {
      const { tree, checkedKeys, halfCheckedKeys } = payload;
      return {
        ...state,
        tree,
        checkedKeys,
        halfCheckedKeys,
      };
    },
    clearResTree(state) {
      return {
        ...state,
        tree: [],
        checkedKeys: [],
        halfCheckedKeys: [],
      };
    },
  },
};
