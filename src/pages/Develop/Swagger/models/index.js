export default {
  namespace: 'developSwagger',

  state: {
    // 所有
    all: {},
    // swagger树
    tree: [],
    // 列表
    list: [],
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      const { fileContent } = payload;
      const { basePath, tags, paths } = fileContent;

      const safeBasePath = `/${basePath
        .split('/')
        .filter(item => item)
        .join('/')}`;
      // 将swagger json内容转换为树及列表展示。
      const tree = [];
      tags.forEach(item => {
        tree.push({ key: item.name, title: item.name });
      });
      // 所有接口
      const all = {};
      const list = [];
      Object.keys(paths).forEach(key => {
        const item = paths[key];
        const starKey = key.replace(/{\w+}/g, '*');
        Object.keys(item).forEach(k => {
          const it = item[k];
          const o = {
            key: it.summary,
            name: it.summary,
            url: `${safeBasePath}${starKey}`,
            code: `${safeBasePath.split('/')[1]}.${starKey
              .split('/')
              .filter(i => i && i !== '*')
              .join('')}.${k}`,
            method: `${k}`,
          };
          if (all[it.tags[0]]) {
            all[it.tags[0]].push(o);
          } else {
            all[it.tags[0]] = [o];
          }
          list.push(o);
        });
      });
      return {
        ...state,
        all,
        tree,
        list,
      };
    },
    clear() {
      return {
        all: {},
        tree: [],
        list: [],
      };
    },
  },
};
