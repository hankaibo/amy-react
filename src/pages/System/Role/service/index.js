import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询角色列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function queryRoleList(params) {
  return request(`/api/v1/roles?${stringify(params)}`);
}

/**
 * 按主键查询一条角色数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryRoleById(id) {
  return request(`/api/v1/roles/${id}`);
}

/**
 * 添加角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function addRole(params) {
  return request('/api/v1/roles', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除角色。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteRole(id) {
  return request(`/api/v1/roles/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除角色。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchRole(ids) {
  return request('/api/v1/roles', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateRole(params) {
  const { id } = params;
  return request(`/api/v1/roles/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用角色。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enabledRole(params) {
  const { id, status } = params;
  return request(`/api/v1/roles/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}

/**
 * 查询完整的资源树。
 * @returns {Promise<void>}
 */
export async function queryResourceByRole(id) {
  return request(`/api/v1/roles/${id}/resources`);
}

/**
 * 赋予角色某资源。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function giveRoleResource(params) {
  const { id, ids } = params;
  return request(`/api/v1/roles/${id}/resources`, {
    method: 'POST',
    data: {
      ids,
    },
  });
}
