import {
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  getDepartmentTree,
  listUser,
  addMessage,
  deleteBatchMessage,
  deleteMessage,
  publishMessage,
  getMessageById,
  pageMessage,
  updateMessage,
  updateMessageReadStatus,
  updateAllMessageReadStatus,
} from '@/services/user';

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
    messageList: [],
    messagePagination: {},
    // 编辑
    message: {},
    // 部门树
    departmentTree: [],
    // 信息过滤参数
    filter: {},
  },

  effects: {
    // 登录用户相关操作
    *fetchCurrentUser({ callback }, { call, put }) {
      const response = yield call(getCurrentUser);
      // TODO
      response.tags = mockTags;
      response.unreadCount = 8;

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
      yield call(updateCurrentUser, values);
      if (callback) callback();
    },
    *updateCurrentUserPassword({ payload, callback }, { call }) {
      yield call(updateCurrentUserPassword, payload);
      if (callback) callback();
    },
    // 登录用户的信息相关操作
    *fetchMessage({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveFilter',
        payload: {
          ...payload,
        },
      });
      const response = yield call(pageMessage, payload);
      const { list, pageNum: current, pageSize, total } = response;
      yield put({
        type: 'saveMessageList',
        payload: {
          messageList: list.map((item) => ({ ...item, status: !!item.status })),
          messagePagination: { current, pageSize, total },
        },
      });
      if (callback) callback();
    },
    *addMessage({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      yield call(addMessage, values);
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
      const message = { ...response, status: !!response.status };
      yield put({
        type: 'saveMessage',
        payload: {
          message,
        },
      });
      if (callback) callback();
    },
    *updateMessage({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      yield call(updateMessage, values);
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
      yield call(publishMessage, id);
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
      yield call(deleteMessage, payload);
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
      yield call(deleteBatchMessage, payload);
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
      const { list } = response;
      const departmentUserList = [];
      list.forEach((item) => {
        const { id, username } = item;
        // 添加前缀避免与部门主键id相同
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
    *changeNoticeReadState({ payload, callback }, { call }) {
      const { id } = payload;
      yield call(updateMessageReadStatus, id);
      if (callback) callback();
    },
    *clearNotices({ payload, callback }, { call }) {
      const { ids } = payload;
      yield call(updateAllMessageReadStatus, ids);
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
    saveMessageList(state, { payload }) {
      const { messageList, messagePagination } = payload;
      return {
        ...state,
        messageList,
        messagePagination,
      };
    },
    clearMessageList(state) {
      return {
        ...state,
        messageList: [],
        messagePagination: {},
      };
    },
    saveMessage(state, { payload }) {
      const { message } = payload;
      return {
        ...state,
        message,
      };
    },
    clearMessage(state) {
      return {
        ...state,
        message: {},
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
