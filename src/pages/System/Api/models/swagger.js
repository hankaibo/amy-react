import { getMenuTree, addApi } from '../services/swagger';

export default {
  namespace: 'developSwagger',

  state: {
    // 接口对象
    swaggerObject: {},
    // swagger树及列表
    tree: [],
    list: [],
    // 菜单树
    menuTree: [],
    // 上传的接口
    selectedRowKeys: [],
  },

  effects: {
    *fetchMenu({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      yield put({
        type: 'saveMenu',
        payload: {
          menuTree: response,
        },
      });
      if (callback) callback();
    },
    *importApi({ payload, callback }, { call, put, select }) {
      const list = yield select((state) => state.developSwagger.list);
      const { id: parentId, swagger } = payload;
      const arrApi = [];
      list
        .filter((item) => swagger.includes(item.id))
        .forEach((it) => {
          // 后台没有提供批量接口，先单个插入
          const api = {
            type: 2,
            status: 1,
            parentId,
            ...it,
          };
          arrApi.push(api);
        });
      for (let i = 0; i < arrApi.length; i += 1) {
        yield call(addApi, arrApi[i]);
      }
      yield put({
        type: 'clearSelected',
      });
      if (callback) callback();
    },
  },

  reducers: {
    uploadFile(state, { payload }) {
      const { fileContent } = payload;
      const { basePath, tags, paths } = fileContent;

      const safeBasePath = `/${basePath
        .split('/')
        .filter((item) => item)
        .join('/')}`;
      // 将swagger json内容转换为树及列表展示。
      const tree = [];
      tags.forEach((item) => {
        tree.push({ key: item.name, title: item.name });
      });
      // 所有接口
      const swaggerObject = {};
      const list = [];
      Object.keys(paths).forEach((key, index) => {
        const item = paths[key];
        const starKey = key.replace(/{\w+}/g, '*');
        Object.keys(item).forEach((k, i) => {
          const it = item[k];
          const o = {
            id: `${index}_${i}`,
            key: `${index}_${i}`,
            name: it.summary,
            uri: `${safeBasePath}${starKey}`,
            code: `${safeBasePath.split('/')[1]}:${starKey
              .split('/')
              .filter((f) => f && f !== '*')
              .join('')}:${k}`,
            method: `${k}`.toUpperCase(),
          };
          if (swaggerObject[it.tags[0]]) {
            swaggerObject[it.tags[0]].push(o);
          } else {
            swaggerObject[it.tags[0]] = [o];
          }
          list.push(o);
        });
      });
      return {
        ...state,
        swaggerObject,
        tree,
        list,
      };
    },
    clearFile(state) {
      return {
        ...state,
        swaggerObject: {},
        tree: [],
        list: [],
      };
    },
    fetch(state, { payload }) {
      const { swaggerObject } = state;
      const { id } = payload;
      const list = swaggerObject[id];
      return {
        ...state,
        list,
      };
    },
    saveMenu(state, { payload }) {
      const { menuTree } = payload;
      return {
        ...state,
        menuTree,
      };
    },
    clearMenu(state) {
      return {
        ...state,
        menuTree: [],
      };
    },
    saveSelected(state, { payload }) {
      const { rowKeys: selectedRowKeys } = payload;
      return {
        ...state,
        selectedRowKeys,
      };
    },
    clearSelected(state) {
      return {
        ...state,
        selectedRowKeys: [],
      };
    },
  },
};
