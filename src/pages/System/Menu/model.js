import {
  getMenuTree,
  listChildrenById,
  addMenu,
  getMenuById,
  updateMenu,
  enableMenu,
  deleteMenu,
  moveMenu,
} from './service';

const MENU_TYPE = 1;

export default {
  namespace: 'systemMenu',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑信息
    menu: {},
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
      yield call(addMenu, params);
      if (id) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id,
            type: MENU_TYPE,
          },
        });
      }
      yield put({
        type: 'fetch',
        payload: {
          type: MENU_TYPE,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getMenuById, id);
      const menu = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          menu,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { values, oldParentId: id } = payload;
      const params = { ...values, status: +values.status };
      yield call(updateMenu, params);
      if (id) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id,
            type: MENU_TYPE,
          },
        });
      }
      yield put({
        type: 'fetch',
        payload: {
          type: MENU_TYPE,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, parentId } = payload;
      const values = { id, status: +status };
      yield call(enableMenu, values);
      if (parentId) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
            type: MENU_TYPE,
          },
        });
      }
      yield put({
        type: 'fetch',
        payload: {
          type: MENU_TYPE,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, parentId } = payload;
      yield call(deleteMenu, id);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
          type: MENU_TYPE,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: MENU_TYPE,
        },
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId: id } = payload;
      yield call(moveMenu, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id,
          type: MENU_TYPE,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          type: MENU_TYPE,
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
      const { menu } = payload;
      return {
        ...state,
        menu,
      };
    },
    clear(state) {
      return {
        ...state,
        menu: {},
      };
    },
  },
};
