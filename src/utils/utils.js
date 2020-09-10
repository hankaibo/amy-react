import { parse } from 'querystring';
import { pathToRegexp } from 'path-to-regexp';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path) => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = (router, pathname) => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathToRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach((route) => {
    // match prefix
    if (pathToRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 将一个父子结构的树扁平化为一个数组。
export function getPlainNode(nodeList) {
  const arr = [];
  nodeList.forEach((item) => {
    arr.push(item);
    if (item.children) {
      arr.push(...getPlainNode(item.children));
    }
  });
  return arr;
}

// 查找一个父子结构树中子节点的所有父节点
export function getParentKey(key, tree) {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}

// 获取对象的所有值
export const getValue = (obj) => {
  if (obj) {
    return Object.keys(obj)
      .map((key) => obj[key])
      .join(',');
  }
  return null;
};

export const difference = (a, b) => {
  const s = new Set(b);
  return a.filter((x) => !s.has(x));
};

// 仿lodash
export const isArray = (obj) => Array.isArray(obj);
export const isEmpty = (obj) => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

// localstorage 简单封装
export const getItem = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;

  let val = '';
  try {
    val = JSON.parse(data);
  } catch (e) {
    val = data;
  }

  return val !== undefined ? val : defaultValue;
};

export const setItem = (key, value) => {
  if (value === undefined) {
    return localStorage.removeItem(key);
  }

  localStorage.setItem(key, JSON.stringify(value));
  return value;
};
