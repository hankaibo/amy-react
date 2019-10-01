import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询用户列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageUser(params) {
  return request(`/users?${stringify(params)}`);
}

/**
 * 按主键查询一条用户数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getUserById(id) {
  return request(`/users/${id}`);
}

/**
 * 添加用户。
 * @param params
 * @returns {Promise<void>}
 */
export async function addUser(params) {
  return request('/users', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除用户。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除用户。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchUser(ids) {
  return request('/users', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新用户。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateUser(params) {
  const { id } = params;
  return request(`/users/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用用户。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableUser(params) {
  const { id, status } = params;
  return request(`/users/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}

/**
 * 查询用户所有角色。
 * @returns {Promise<void>}
 */
export async function listUserRole(id) {
  return request(`/users/${id}/roles`);
}

/**
 * 赋予用户某角色。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function grantUserRole(params) {
  const { id, ...rest } = params;
  return request(`/users/${id}/roles`, {
    method: 'POST',
    data: rest,
  });
}
