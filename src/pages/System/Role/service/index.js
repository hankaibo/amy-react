import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询角色列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageRole(params) {
  return request(`/roles?${stringify(params)}`);
}

/**
 * 添加角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function addRole(params) {
  return request('/roles', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条角色数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getRoleById(id) {
  return request(`/roles/${id}`);
}

/**
 * 更新角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateRole(params) {
  const { id } = params;
  return request(`/roles/${id}`, {
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
export async function enableRole(params) {
  const { id, status } = params;
  return request(`/roles/${id}`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}

/**
 * 删除角色。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteRole(id) {
  return request(`/roles/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除角色。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchRole(ids) {
  return request('/roles', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 查询完整的资源树。
 * @returns {Promise<void>}
 */
export async function getResourceByRole(id) {
  return request(`/roles/${id}/resources`);
}

/**
 * 赋予角色某资源。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function grantRoleResource(params) {
  const { id, ...rest } = params;
  return request(`/roles/${id}/resources`, {
    method: 'POST',
    data: rest,
  });
}
