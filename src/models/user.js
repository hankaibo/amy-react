import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import { formatMessage } from 'umi-plugin-react/locale';
import queryCurrent from '@/services/user';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

const filterLevel1 = (routes, names) => {
  return routes.filter(route => !route.dynamic || (route.dynamic && names.includes(route.name)));
};

const filyer = (sectionList, route, deep) => {
  const obj = { ...route };
  const sections = sectionList.filter(s => s.indexOf(route.name) === 0);
  if (!route.dynamic && (!obj.routes || !obj.routes.length)) return obj;
  if (!sections.length && route.dynamic && deep !== 0) {
    return null;
  }
  const oneLevel = sections
    .filter(item => item.split('.').length >= 2)
    .map(item => item.split('.')[1]);
  const levelMore = sections
    .filter(item => item.split('.').length > 2)
    .map(item =>
      item
        .split('.')
        .slice(1)
        .join('.')
    );
  obj.routes = filterLevel1(obj.routes, oneLevel);
  if (levelMore.length) {
    const list = [];
    const newDeep = deep + 1;
    obj.routes.forEach(item => {
      list.push(filyer(levelMore, item, newDeep));
    });
    obj.routes = list.filter(a => a);
  }
  return obj;
};

/**
 *
 * @param routes
 * @param menuList 数组中就是包含的动态路由
 * @return {Array|*[]}
 */
const filterRouters = (routes, menuList) => {
  if (!routes) return [];
  const sectionList = menuList.filter(item => item && isString(item));
  const oneLevel = sectionList
    .filter(item => item.split('.').length >= 1)
    .map(item => item.split('.')[0]);
  const levelMore = sectionList.filter(item => item.split('.').length > 1);
  const newRoutes = filterLevel1(routes, oneLevel);
  const list = [];
  newRoutes.forEach(route => {
    const deep = 0;
    list.push(filyer(levelMore, route, deep));
  });
  return list.filter(item => item);
};

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    // 用一个接口获取用户个人信息及菜单信息，当然也可以分成两个接口分别获取，我为了省事，一个接口搞定了。
    *fetchCurrent({ payload }, { call, put }) {
      // 查询登录用户的个人与菜单信息数据
      const response = yield call(queryCurrent);
      if (response.success) {
        const { menuList, user } = response.data;
        // 拿出路由
        const { routes, authority } = payload;
        const routerMap = filterRouters(routes, menuList); // 这边取出实际的路由表
        const menuData = filterMenuData(memoizeOneFormatter(routerMap, authority));
        // const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
        // 这是修改后的代码，因为menuData是已经过滤掉存在hideInMenu
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(
          memoizeOneFormatter(routerMap, authority)
        );
        yield put({
          type: 'save',
          payload: {
            currentUser: user,
            menuData,
            breadcrumbNameMap,
            routerMap,
            routerData: routes,
          }, // 将实际的路由一同放入
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
