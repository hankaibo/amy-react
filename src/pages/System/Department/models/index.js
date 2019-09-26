import {
  getDepartmentTree,
  getDepartmentById,
  getChildrenById,
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
    departmentTree: [],
    // 列表
    list: [],
    // 编辑信息
    editDepartment: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      const { data } = response;
      yield put({
        type: 'saveDepartmentTree',
        payload: {
          departmentTree: data,
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
    *moveDepartment({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      yield call(moveDepartment, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getDepartmentById, id);
      const { data } = response;
      const editDepartment = { ...data, status: !!data.status };
      yield put({
        type: 'saveDepartment',
        payload: {
          editDepartment,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const params = { ...payload, status: +payload.status };
      yield call(addDepartment, params);
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      yield call(deleteDepartment, id);
      const oldList = yield select(state => state.systemDepartment.list);
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
      if (callback) callback();
    },
  },

  reducers: {
    saveDepartmentTree(state, { payload }) {
      const { departmentTree } = payload;
      return {
        ...state,
        departmentTree,
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    saveDepartment(state, { payload }) {
      const { editDepartment } = payload;
      return {
        ...state,
        editDepartment,
      };
    },
    clearDepartment(state) {
      return {
        ...state,
        editDepartment: {},
      };
    },
  },
};
