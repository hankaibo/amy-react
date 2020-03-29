import {
  getMenuTree,
  listChildrenById,
  addApi,
  getApiById,
  updateApi,
  enableApi,
  deleteApi,
  deleteBatchApi,
  moveButton,
} from '../services/api';

export default {
  namespace: 'systemApi',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑
    api: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      const response = yield call(listChildrenById, payload);
      const list = response.map((item) => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { values, oldParentId: id } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(addApi, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      if (id) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id,
            type: values.type,
          },
        });
      }
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getApiById, id);
      const api = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          api,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { values, oldParentId: id } = payload;
      const params = { ...values, status: +values.status };
      yield call(updateApi, params);
      if (id) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id,
            type: values.type,
          },
        });
      }
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, type, parentId } = payload;
      const params = { id, status: +status, type };
      yield call(enableApi, params);
      if (parentId) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
            type,
          },
        });
      }
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, type, parentId } = payload;
      yield call(deleteApi, id);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
          type,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchApi, ids);
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId: id } = payload;
      yield call(moveButton, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id,
          type: payload.type,
        },
      });
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
      const { api } = payload;
      return {
        ...state,
        api,
      };
    },
    clear(state) {
      return {
        ...state,
        api: {},
      };
    },
  },
};
