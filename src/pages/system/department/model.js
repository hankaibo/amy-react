import {
  addDepartment,
  deleteDepartment,
  enableDepartment,
  getDepartmentById,
  getDepartmentTree,
  listSubDepartmentById,
  moveDepartment,
  updateDepartment,
} from './service';

export default {
  namespace: 'systemDepartment',

  state: {
    // 部门树
    tree: [],
    // 列表
    list: [],
    // 编辑信息
    department: {},
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(listSubDepartmentById, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const list = response.map((item) => ({ ...item, status: item.status === 'ENABLED' }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(addDepartment, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDepartment.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
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
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const department = {
        ...response,
        status: response.status === 'ENABLED',
        parentId: `${response.parentId}`,
      };
      yield put({
        type: 'save',
        payload: {
          department,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: payload.status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(updateDepartment, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDepartment.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const values = { id, status: status ? 'ENABLED' : 'DISABLED' };
      const response = yield call(enableDepartment, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDepartment.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteDepartment, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDepartment.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put, select }) {
      const response = yield call(moveDepartment, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemDepartment.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveFilter(state, { payload }) {
      return {
        ...state,
        filter: {
          ...payload,
        },
      };
    },
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
        filter: {},
      };
    },
    save(state, { payload }) {
      const { department } = payload;
      return {
        ...state,
        department,
      };
    },
    clear(state) {
      return {
        ...state,
        department: {},
      };
    },
  },
};
