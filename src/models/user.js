import { getCurrentUser, updateCurrentUser, updateCurrentUserPassword } from '@/services/user';
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

const UserModel = {
  namespace: 'user',

  state: {
    currentUser: {},
    // 信息列表及分页
    list: [],
    pagination: {},
    // 编辑
    msg: {},
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
      const { id } = payload;
      const response = yield call(getMessageById, id);
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
      const { id } = payload;
      const response = yield call(deleteMessage, id);
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
      const { ids } = payload;
      const response = yield call(deleteBatchMessage, ids);
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
  },
};

export default UserModel;
