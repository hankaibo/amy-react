import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @returns {Promise<void>}
 */
export async function getMenuTree() {
  return request('/resources?type=');
}

/**
 * 按主键查询所有子菜单数据。
 * @param payload
 * @returns {Promise<void>}
 */
export async function listChildrenById(payload) {
  const { id, ...rest } = payload;
  rest.type = 1;
  return request(`/resources/${id}/children?${stringify(rest)}`);
}

/**
 * 添加菜单。
 * @param params
 * @returns {Promise<void>}
 */
export async function addMenu(params) {
  return request('/resources', {
    method: 'POST',
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
  return request(`/resources/${id}`, {
    method: 'PUT',
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
  const { id, status } = params;
  return request(`/resources/${id}`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}

/**
 * 按主键上移下移菜单。
 * @param params {sourceId,targetId} 源菜单与目标菜单
 * @returns {Promise<void>}
 */
export async function moveMenu(params) {
  const { sourceId, targetId } = params;
  return request(`/resources?from=${sourceId}&to=${targetId}`, {
    method: 'PUT',
  });
}

/**
 * 删除菜单。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteMenu(id) {
  return request(`/resources/${id}`, {
    method: 'DELETE',
  });
}
