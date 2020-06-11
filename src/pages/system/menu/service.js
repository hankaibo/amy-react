import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @returns {Promise<void>}
 */
export async function getMenuTree(params = { type: 1 }) {
  return request(`/resources?${stringify(params)}`);
}

/**
 * 按主键查询所有子菜单数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function listChildrenById(params) {
  const { id, ...rest } = params;
  return request(`/resources/${id}/children?${stringify(rest)}`);
}

/**
 * 添加菜单。
 * @param params
 * @returns {Promise<void>}
 */
export async function addMenu(params) {
  return request.post('/resources', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条菜单数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getMenuById(id) {
  return request(`/resources/${id}`);
}

/**
 * 更新菜单。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateMenu(params) {
  const { id } = params;
  return request.put(`/resources/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用菜单。
 * @param params
 * @return {Promise<void>}
 */
export async function enableMenu(params) {
  const { id, ...rest } = params;
  return request.patch(`/resources/${id}/status?${stringify(rest)}`);
}

/**
 * 按主键上移下移菜单。
 * @param params {sourceId,targetId} 源菜单与目标菜单
 * @returns {Promise<void>}
 */
export async function moveMenu(params) {
  const { sourceId, targetId } = params;
  return request.put(`/resources?from=${sourceId}&to=${targetId}`);
}

/**
 * 删除菜单。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteMenu(id) {
  return request.delete(`/resources/${id}`);
}
