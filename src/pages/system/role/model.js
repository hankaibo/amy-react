import {
  getRoleTree,
  listSubRoleById,
  addRole,
  getRoleById,
  updateRole,
  enableRole,
  deleteRole,
  moveRole,
  getResourceByRole,
  grantRoleResource,
} from './service';

export default {
  namespace: 'systemRole',

  state: {
    // 角色树
    tree: [],
    // 列表
    list: [],
    // 编辑
    role: {},
    // 资源树、选中keys、半联动的keys
    treeData: [],
    checkedKeys: [],
    halfCheckedKeys: [],
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ callback }, { call, put }) {
      const response = yield call(getRoleTree);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(listSubRoleById, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const list = response.map((item) => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(addRole, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRole.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getRoleById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const role = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          role,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(updateRole, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRole.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      const response = yield call(enableRole, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRole.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteRole, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRole.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put, select }) {
      const response = yield call(moveRole, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemRole.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchResTree({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getResourceByRole, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { resTree, resSelected } = response;
      const selected = [];
      const halfSelected = [];
      // 分离出半联动的父节点
      resSelected.forEach((item) => {
        if (item.rgt - item.lft === 1) {
          selected.push(item);
        } else {
          halfSelected.push(item);
        }
      });
      yield put({
        type: 'saveResTree',
        payload: {
          treeData: resTree,
          checkedKeys: selected.map((item) => item.id.toString()),
          halfCheckedKeys: halfSelected.map((item) => item.id.toString()),
        },
      });
      if (callback) callback();
    },
    *grantRoleResource({ payload, callback }, { call }) {
      const response = yield call(grantRoleResource, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      if (callback) callback();
    },
  },

  reducers: {
    saveFilter(state, { payload }) {
      return {
        ...state,
        filter: {
          ...payload,
        },
      };
    },
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
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    clearList(state) {
      return {
        ...state,
        list: [],
        filter: {},
      };
    },
    save(state, { payload }) {
      const { role } = payload;
      return {
        ...state,
        role,
      };
    },
    clear(state) {
      return {
        ...state,
        role: {},
      };
    },
    saveResTree(state, { payload }) {
      const { treeData, checkedKeys, halfCheckedKeys } = payload;
      return {
        ...state,
        treeData,
        checkedKeys,
        halfCheckedKeys,
      };
    },
    clearResTree(state) {
      return {
        ...state,
        treeData: [],
        checkedKeys: [],
        halfCheckedKeys: [],
      };
    },
  },
};
