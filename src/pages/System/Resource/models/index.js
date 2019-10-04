import {
  getResourceTree,
  getResourceById,
  getChildrenById,
  moveResource,
  addResource,
  deleteResource,
  deleteBatchResource,
  updateResource,
} from '../service';

export default {
  namespace: 'systemResource',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑
    editResource: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getResourceTree, payload);
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getChildrenById, id);
      const list = response.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId: id } = payload;
      yield call(moveResource, payload);
      yield put({
        type: 'fetch',
      });
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getResourceById, id);
      const editResource = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          editResource,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { parentId: id } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(addResource, params);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, parentId } = payload;
      yield call(deleteResource, id);
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
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchResource, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(updateResource, params);
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
  },

  reducers: {
    saveTree(state, { payload }) {
      const { tree } = payload;
      return {
        ...state,
        tree,
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    save(state, { payload }) {
      const { editResource } = payload;
      return {
        ...state,
        editResource,
      };
    },
    clear(state) {
      return {
        ...state,
        editResource: {},
      };
    },
  },
};
