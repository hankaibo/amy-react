import {
  getMenuTree,
  listChildrenById,
  addButton,
  getButtonById,
  updateButton,
  enableButton,
  deleteButton,
  deleteBatchButton,
  moveButton,
} from '../service';

export default {
  namespace: 'systemApi',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑
    editButton: {},
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
      const { parentId: id } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(addButton, params);
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
      const response = yield call(getButtonById, id);
      const editButton = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          editButton,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(updateButton, params);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, parentId } = payload;
      const params = { id, status: +status };
      yield call(enableButton, params);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, parentId } = payload;
      yield call(deleteButton, id);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchButton, ids);
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId: id } = payload;
      yield call(moveButton, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id,
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
      const { editButton } = payload;
      return {
        ...state,
        editButton,
      };
    },
    clear(state) {
      return {
        ...state,
        editButton: {},
      };
    },
  },
};
