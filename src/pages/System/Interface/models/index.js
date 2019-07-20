import {
  queryInterfaceTree,
  queryChildrenById,
  moveInterface,
  queryInterfaceById,
  addInterface,
  deleteInterface,
  deleteBatchInterface,
  updateInterface,
} from '../service';

export default {
  namespace: 'systemInterface',

  state: {
    treeData: [],
    list: [],
    selected: {},
  },

  effects: {
    *fetch({ _ }, { call, put }) {
      console.log(_);
      const response = yield call(queryInterfaceTree);
      const { data } = response;
      yield put({
        type: 'saveTreeData',
        payload: {
          treeData: data,
        },
      });
    },
    *fetchChildrenById({ id }, { call, put }) {
      const response = yield call(queryChildrenById, id);
      const { data } = response;
      yield put({
        type: 'saveList',
        payload: {
          list: data,
        },
      });
    },
    *moveInterface({ payload, callback }, { call }) {
      yield call(moveInterface, payload);
      if (callback) callback();
    },
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryInterfaceById, id);
      const { data } = response;
      const info = { ...data, status: !!data.status };
      yield put({
        type: 'selected',
        payload: {
          info,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const params = { ...payload, status: +payload.status };
      yield call(addInterface, params);
      if (callback) callback();
    },
    *delete({ id, callback }, { call, put, select }) {
      yield call(deleteInterface, id);
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
      yield call(deleteBatchInterface, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateInterface, params);
      const oldList = yield select(state => state.systemInterface.list);
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
    saveTreeData(state, { payload }) {
      const { treeData } = payload;
      return {
        ...state,
        treeData,
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    selected(state, { payload }) {
      const { info } = payload;
      return {
        ...state,
        selected: info,
      };
    },
    unselected(state) {
      return {
        ...state,
        selected: {},
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
