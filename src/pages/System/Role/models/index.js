import {
  pageRole,
  getRoleById,
  addRole,
  deleteRole,
  deleteBatchRole,
  updateRole,
  enableRole,
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
    // 分配资源树及选中
    resTree: [],
    resSelected: [],
    halfCheckedKeys: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(pageRole, payload);
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
      const response = yield call(getRoleById, id);
      const { data } = response;
      const editRole = { ...data, status: !!data.status };
      yield put({
        type: 'saveRole',
        payload: {
          editRole,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(addRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
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
      yield call(updateRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
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
      const {
        data: { resTree, resSelected },
      } = response;
      const selected = [];
      const halfSelect = [];
      resSelected.forEach(item => {
        if (item.rgt - item.lft === 1) {
          selected.push(item);
        } else {
          halfSelect.push(item);
        }
      });
      yield put({
        type: 'saveResTree',
        payload: {
          resTree,
          resSelected: selected.map(item => item.id.toString()),
          halfCheckedKeys: halfSelect.map(item => item.id.toString()),
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
    saveRole(state, { payload }) {
      const { editRole } = payload;
      return {
        ...state,
        editRole,
      };
    },
    saveResTree(state, { payload }) {
      const { resTree, resSelected, halfCheckedKeys } = payload;
      return {
        ...state,
        resTree,
        resSelected,
        halfCheckedKeys,
      };
    },
  },
};
