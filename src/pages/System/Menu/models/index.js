import {
  queryMenuTree,
  queryMenuById,
  queryChildrenById,
  moveMenu,
  addMenu,
  deleteMenu,
  deleteBatchMenu,
  updateMenu,
} from '../service';

export default {
  namespace: 'systemMenu',

  state: {
    // 菜单树
    menuTree: [],
    // 列表
    list: [],
    // 编辑信息
    info: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMenuTree, payload);
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
    *moveMenu({ payload, callback }, { call }) {
      yield call(moveMenu, payload);
      if (callback) callback();
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryMenuById, id);
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
      yield call(addMenu, params);
      if (callback) callback();
    },
    *delete({ id, callback }, { call, put, select }) {
      yield call(deleteMenu, id);
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
      yield call(deleteBatchMenu, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateMenu, params);
      const oldList = yield select(state => state.systemMenu.list);
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
