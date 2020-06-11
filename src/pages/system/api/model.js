import {
  addApi,
  deleteApi,
  deleteBatchApi,
  enableApi,
  getApiById,
  getMenuTree,
  importBatchApi,
  listChildrenById,
  moveButton,
  updateApi,
} from './service';

export default {
  namespace: 'systemApi',

  state: {
    // 菜单树
    tree: [],
    // 列表
    list: [],
    // 编辑
    api: {},
    // 上传接口列表
    apiList: [],
    apiListBackup: [],
    // 过滤参数
    filter: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
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
      const response = yield call(listChildrenById, payload);
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
    *add({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(addApi, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemApi.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });

      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getApiById, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const api = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          api,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const values = { ...payload, status: +payload.status };
      const response = yield call(updateApi, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemApi.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put, select }) {
      const { id, status } = payload;
      const values = { id, status: +status };
      const response = yield call(enableApi, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemApi.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });

      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteApi, id);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemApi.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *deleteBatch({ ids, callback }, { call }) {
      yield call(deleteBatchApi, ids);
      if (callback) callback();
    },
    *move({ payload, callback }, { call, put, select }) {
      const { searchParams, ...values } = payload;
      const response = yield call(moveButton, values);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      const filter = yield select((state) => state.systemApi.filter);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          ...filter,
        },
      });
      if (callback) callback();
    },
    *importBatch({ payload, callback }, { call, put, select }) {
      const { parentId, ids } = payload;
      const list = yield select((state) => state.systemApi.apiList);
      const arrApi = list
        .filter((item) => ids.includes(item.id))
        .map((it) => {
          const { name, uri, code, method } = it;
          return {
            type: 2,
            status: 1,
            parentId,
            name,
            uri,
            code,
            method,
          };
        });
      const response = yield call(importBatchApi, arrApi);
      const { apierror } = response;
      if (apierror) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          type: 2,
          id: parentId,
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
      const { api } = payload;
      return {
        ...state,
        api,
      };
    },
    clear(state) {
      return {
        ...state,
        api: {},
      };
    },
    uploadFile(state, { payload }) {
      const { fileContent } = payload;
      const { basePath, paths } = fileContent;

      const safeBasePath = `/${basePath
        .split('/')
        .filter((item) => item)
        .join('/')}`;
      // 所有接口
      const apiList = [];
      Object.keys(paths).forEach((key, index) => {
        const item = paths[key];
        const starKey = key.replace(/{\w+}/g, '*');
        Object.keys(item).forEach((k, i) => {
          const it = item[k];
          const uri = starKey.startsWith('/') ? starKey : `${safeBasePath}${starKey}`;
          const o = {
            id: `${index}_${i}`,
            key: `${index}_${i}`,
            name: it.summary,
            uri,
            code: `${safeBasePath.split('/')[1]}:${starKey
              .split('/')
              .filter((f) => f && f !== '*')
              .join('')}:${k}`,
            method: `${k}`.toUpperCase(),
          };
          apiList.push(o);
        });
      });
      return {
        ...state,
        apiList,
        apiListBackup: apiList,
      };
    },
    clearFile(state) {
      return {
        ...state,
        apiList: [],
        apiListBackup: [],
      };
    },
    updateFile(state, { payload }) {
      const reducer = (item) => {
        const newItem = { ...item };
        payload.forEach((it) => {
          const key = Object.keys(it)[0];
          newItem[key] = it[key] + newItem[key];
        });
        return newItem;
      };
      return {
        ...state,
        apiList: state.apiListBackup.map((item) => reducer(item)),
      };
    },
  },
};
