import {
  queryRoleList,
  queryRoleById,
  addRole,
  deleteRole,
  deleteBatchRole,
  updateRole,
  enabledRole,
  queryResourceByRole,
  giveRoleResource,
} from '../service';

export default {
  namespace: 'systemRole',

  state: {
    // 列表及分页
    list: [],
    pagination: {},
    // 分配资源树及选中
    resTree: [],
    resSelected: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      const { list, pageNum: current, pageSize, total } = response.data;
      const newList = list.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list: newList,
          pagination: { current, pageSize, total },
        },
      });
    },
    *fetchById({ payload, callback }, { call }) {
      const { id } = payload;
      const response = yield call(queryRoleById, id);
      const { data } = response;
      if (callback) callback();
      return { ...data, status: !!data.status };
    },
    *add({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(addRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      yield call(deleteRole, id);
      const pagination = yield select(state => state.systemRole.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ payload, callback }, { call, put, select }) {
      const { ids } = payload;
      yield call(deleteBatchRole, ids);
      const pagination = yield select(state => state.systemRole.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      yield call(enabledRole, params);
      const pagination = yield select(state => state.systemRole.pagination);
      yield put({
        type: 'fetch',
        payload: {
          ...pagination,
        },
      });
      if (callback) callback();
    },
    *fetchResTree({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(queryResourceByRole, id);
      const {
        data: { resTree, resSelected },
      } = response;
      yield put({
        type: 'saveResTree',
        payload: {
          resTree,
          resSelected: resSelected.filter(item => item.rgt - item.lft === 1).map(item => item.id.toString()),
        },
      });
      if (callback) callback();
    },
    *giveRoleResource({ payload, callback }, { call }) {
      yield call(giveRoleResource, payload);
      if (callback) callback();
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination,
      };
    },
    saveResTree(state, { payload }) {
      const { resTree, resSelected, roleId } = payload;
      return {
        ...state,
        resTree,
        resSelected,
        roleId,
      };
    },
    clearRes(state) {
      return {
        ...state,
        resTree: [],
        resSelected: [],
      };
    },
  },
};
