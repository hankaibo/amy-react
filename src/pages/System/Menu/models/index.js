import {
  getMenuTree,
  getMenuById,
  getChildrenById,
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
    editMenu: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
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
    *moveMenu({ payload, callback }, { call, put }) {
      yield call(moveMenu, payload);
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getMenuById, id);
      const { data } = response;
      const editMenu = { ...data, status: !!data.status };
      yield put({
        type: 'saveMenu',
        payload: {
          editMenu,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const params = { ...payload, status: +payload.status };
      yield call(addMenu, params);
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
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
    saveMenu(state, { payload }) {
      const { editMenu } = payload;
      return {
        ...state,
        editMenu,
      };
    },
    clearMenu(state) {
      return {
        ...state,
        editMenu: {},
      };
    },
  },
};
