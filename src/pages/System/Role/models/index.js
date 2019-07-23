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
    // 编辑信息
    info: {},
    // 分配资源树及选中
    roleId: '',
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
    *fetchById({ id, callback }, { call, put }) {
      const response = yield call(queryRoleById, id);
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
      const data = { ...payload, status: +payload.status };
      yield call(addRole, data);
      if (callback) callback();
    },
    *delete({ id, callback }, { call }) {
      yield call(deleteRole, id);
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchRole, ids);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const params = { ...payload, status: +payload.status };
      yield call(updateRole, params);
      const oldList = yield select(state => state.systemRole.list);
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
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const params = { id, status: +status };
      yield call(enabledRole, params);
      const oldList = yield select(state => state.systemRole.list);
      const newList = oldList.map(item => {
        if (item.id === id) return { ...item, status };
        return { ...item, status: !!item.status };
      });
      yield put({
        type: 'updateList',
        payload: {
          list: newList,
        },
      });
      if (callback) callback();
    },
    *fetchResTree({ record, callback }, { call, put }) {
      const { id } = record;
      const response = yield call(queryResourceByRole, id);
      const {
        data: { resTree, resSelected },
      } = response;
      yield put({
        type: 'saveResTree',
        payload: {
          resTree,
          resSelected: resSelected.map(item => item.id),
          roleId: id,
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
        roleId: '',
      };
    },
  },
};
