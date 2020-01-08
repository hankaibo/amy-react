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
    // 资源树、选中的Keys、半联动的keys
    resourceTree: [],
    checkedKeys: [],
    halfCheckedKeys: [],
  },

  effects: {
    *fetch({ callback }, { call, put }) {
      const response = yield call(getRoleTree);
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      const response = yield call(listSubRoleById, payload);
      const list = response.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { oldParentId: parentId } = payload;
      const params = { ...payload, status: +payload.status };
      const response = yield call(addRole, params);
      if (response) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
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
      const role = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          role,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { oldParentId: parentId } = payload;
      const params = { ...payload, status: +payload.status };
      const response = yield call(updateRole, params);
      if (response) {
        return;
      }
      if (parentId) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
          },
        });
      }
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, parentId } = payload;
      const params = { id, status: +status };
      const response = yield call(enableRole, params);
      if (response) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, parentId } = payload;
      const response = yield call(deleteRole, id);
      if (response) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      yield call(moveRole, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
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
          resourceTree: resTree,
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
      const { resourceTree, checkedKeys, halfCheckedKeys } = payload;
      return {
        ...state,
        resourceTree,
        checkedKeys,
        halfCheckedKeys,
      };
    },
    clearResTree(state) {
      return {
        ...state,
        resourceTree: [],
        checkedKeys: [],
        halfCheckedKeys: [],
      };
    },
  },
};
