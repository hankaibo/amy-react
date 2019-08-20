import {
  queryResourceTree,
  queryResourceById,
  queryChildrenById,
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
    info: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryResourceTree, payload);
      const { data } = response;
      yield put({
        type: 'saveMenuTree',
        payload: {
          menuTree: data,
        },
      });
    },
    *fetchChildrenById({ id }, { call, put }) {
      const response = yield call(queryChildrenById, id);
      const { data } = response;
      const newList = data.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list: newList,
        },
      });
    },
    *moveResource({ payload, callback }, { call }) {
      yield call(moveResource, payload);
      if (callback) callback();
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryResourceById, id);
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
    saveInfo(state, { payload }) {
      const { info } = payload;
      return {
        ...state,
        info,
      };
    },
    clearInfo(state) {
      return {
        ...state,
        info: {},
      };
    },
    updateList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
  },
};
