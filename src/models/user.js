import {
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  getDepartmentTree,
  listUser,
} from '@/services/user';
import {
  addMessage,
  deleteBatchMessage,
  deleteMessage,
  publishMessage,
  getMessageById,
  pageMessage,
  updateMessage,
} from '@/services/notice';

const mockTags = [
  {
    key: '0',
    label: '很有想法的',
  },
  {
    key: '1',
    label: '专注设计',
  },
  {
    key: '2',
    label: '辣~',
  },
  {
    key: '3',
    label: '大长腿',
  },
  {
    key: '4',
    label: '川妹子',
  },
  {
    key: '5',
    label: '海纳百川',
  },
];

// 禁用树数据可选状态及隐藏复选框
const formatTree = (tree) => {
  tree.forEach((item) => {
    if (item.children) {
      // eslint-disable-next-line no-unused-vars
      formatTree(item.children);
    }
    // eslint-disable-next-line no-param-reassign
    item.selectable = false;
    // eslint-disable-next-line no-param-reassign
    item.checkable = false;
  });
};

const addToTree = (id, data, tree) => {
  tree.forEach((item) => {
    if (item.id === id) {
      item.children.push(...data);
    } else if (item.children) {
      addToTree(id, data, item.children);
    }
  });
};

const UserModel = {
  namespace: 'user',

  state: {
    currentUser: {},
    // 信息列表及分页
    list: [],
    pagination: {},
    // 编辑
    msg: {},
    // 部门树
    departmentTree: [],
    // 过滤参数
    filter: {},
  },

  effects: {
    // 登录用户相关操作
    *fetchCurrentUser({ callback }, { call, put }) {
      const response = yield call(getCurrentUser);
      response.tags = mockTags;
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: {
          currentUser: response,
        },
      });
      if (callback) callback();
    },
    *updateCurrentUser({ payload, callback }, { call }) {
      const values = { ...payload };
      const response = yield call(updateCurrentUser, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      if (callback) callback();
    },
    *updateCurrentUserPassword({ payload, callback }, { call }) {
      const response = yield call(updateCurrentUserPassword, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      if (callback) callback();
    },
    // 登录用户的信息相关操作
    *fetchMessage({ payload, callback }, { call, put, select }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(pageMessage, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveMessageList',
        payload: {
          list: list.map((item) => ({ ...item, status: !!item.status })),
          pagination: { current, pageSize, total },
        },
      });
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'changeNotifyCount',
        payload: {
          totalCount: total,
          unreadCount,
        },
      });
      if (callback) callback();
    },
    *addMessage({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(addMessage, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.user.filter);
      yield put({
        type: 'fetchMessage',
        payload: {
          ...filter,
          current: 1,
        },
      });
      if (callback) callback();
    },
    *fetchMessageById({ payload, callback }, { call, put }) {
      const response = yield call(getMessageById, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const msg = { ...response, status: !!response.status };
      yield put({
        type: 'saveMessage',
        payload: {
          msg,
        },
      });
      if (callback) callback();
    },
    *updateMessage({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(updateMessage, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.user.filter);
      yield put({
        type: 'fetchMessage',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *publishMessage({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(publishMessage, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.user.filter);
      yield put({
        type: 'fetchMessage',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *deleteMessage({ payload, callback }, { call, put, select }) {
      const response = yield call(deleteMessage, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.user.filter);
      yield put({
        type: 'fetchMessage',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *deleteBatchMessage({ payload, callback }, { call, put, select }) {
      const response = yield call(deleteBatchMessage, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.user.filter);
      yield put({
        type: 'fetchMessage',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *fetchDepartmentTree({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      formatTree(response);
      yield put({
        type: 'saveDepartmentTree',
        payload: {
          departmentTree: response,
        },
      });
      if (callback) callback();
    },
    *fetchDepartmentUser({ payload, callback }, { call, put, select }) {
      const response = yield call(listUser, payload);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const { list } = response;
      const departmentUserList = [];
      list.forEach((item) => {
        const { id, username } = item;
        const user = {
          id,
          key: `u_${id}`,
          value: `u_${id}`,
          title: username,
          isLeaf: true,
        };
        departmentUserList.push(user);
      });
      const departmentTree = yield select((state) => state.user.departmentTree);
      const newDepartmentTree = JSON.parse(JSON.stringify(departmentTree));

      addToTree(payload.departmentId, departmentUserList, newDepartmentTree);
      yield put({
        type: 'saveDepartmentTree',
        payload: {
          departmentTree: newDepartmentTree,
        },
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
    saveCurrentUser(state, { payload }) {
      const { currentUser } = payload;
      return {
        ...state,
        currentUser,
      };
    },
    changeNotifyCount(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: payload.totalCount,
          unreadCount: payload.unreadCount,
        },
      };
    },
    saveMessageList(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination,
      };
    },
    clearMessageList(state) {
      return {
        ...state,
        list: [],
        pagination: {},
      };
    },
    saveMessage(state, { payload }) {
      const { msg } = payload;
      return {
        ...state,
        msg,
      };
    },
    clearMessage(state) {
      return {
        ...state,
        msg: {},
      };
    },
    saveDepartmentTree(state, { payload }) {
      const { departmentTree } = payload;
      return {
        ...state,
        departmentTree,
      };
    },
    clearDepartmentTree(state) {
      return {
        ...state,
        departmentTree: [],
      };
    },
  },
};

export default UserModel;
