import {
  getDepartmentTree,
  getDepartmentById,
  getDepartmentChildrenById,
  moveDepartment,
  addDepartment,
  deleteDepartment,
  deleteBatchDepartment,
  updateDepartment,
} from '../service';

export default {
  namespace: 'systemDepartment',

  state: {
    // 部门树
    tree: [],
    // 列表
    list: [],
    // 编辑信息
    editDepartment: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
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
      const response = yield call(getDepartmentChildrenById, id);
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
      const { parentId } = payload;
      yield call(moveDepartment, payload);
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
      const response = yield call(getDepartmentById, id);
      const editDepartment = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          editDepartment,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(addDepartment, params);
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
      yield call(deleteDepartment, id);
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
      yield call(deleteBatchDepartment, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      const params = { ...payload, status: +payload.status };
      yield call(updateDepartment, params);
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
      const { editDepartment } = payload;
      return {
        ...state,
        editDepartment,
      };
    },
    clear(state) {
      return {
        ...state,
        editDepartment: {},
      };
    },
  },
};
