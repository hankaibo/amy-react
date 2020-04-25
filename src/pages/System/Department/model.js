import {
  getDepartmentTree,
  listSubDepartmentById,
  addDepartment,
  getDepartmentById,
  updateDepartment,
  enableDepartment,
  deleteDepartment,
  moveDepartment,
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
      const response = yield call(listSubDepartmentById, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
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
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(addDepartment, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...searchParams,
          current: 1,
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
        status: !!response.status,
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
    *update({ payload, callback }, { call, put }) {
      const { values, searchParams } = payload;
      const params = { ...values, status: +values.status };
      const response = yield call(updateDepartment, params);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...searchParams,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, searchParams } = payload;
      const values = { id, status: +status };
      const response = yield call(enableDepartment, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...searchParams,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, searchParams } = payload;
      const response = yield call(deleteDepartment, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...searchParams,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put }) {
      const { searchParams, ...values } = payload;
      const response = yield call(moveDepartment, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...searchParams,
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
