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
    menuTree: [],
    // 列表
    list: [],
    // 编辑
    editResource: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getResourceTree, payload);
      const { data } = response;
      yield put({
        type: 'saveMenuTree',
        payload: {
          menuTree: data,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getChildrenById, id);
      const { data } = response;
      const list = data.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *moveResource({ payload, callback }, { call, put }) {
      yield call(moveResource, payload);
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getResourceById, id);
      const { data } = response;
      const editResource = { ...data, status: !!data.status };
      yield put({
        type: 'saveResource',
        payload: {
          editResource,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const params = { ...payload, status: +payload.status };
      yield call(addResource, params);
      if (callback) callback();
    },
    *delete({ id, callback }, { call, put, select }) {
      yield call(deleteResource, id);
      const oldList = yield select(state => state.systemMenu.list);
      const newList = oldList.filter(item => item.id !== id);
      yield put({
        type: 'updateList',
        payload: {
          list: newList,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchResource, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateResource, params);
      const oldList = yield select(state => state.systemResource.list);
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
  },

  reducers: {
    saveMenuTree(state, { payload }) {
      const { menuTree } = payload;
      return {
        ...state,
        menuTree,
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    saveResource(state, { payload }) {
      const { editResource } = payload;
      return {
        ...state,
        editResource,
      };
    },
    clearResource(state) {
      return {
        ...state,
        editResource: {},
      };
    },
  },
};
