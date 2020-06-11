import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取整棵部门树数据。
 * @returns {Promise<void>}
 */
export async function getDepartmentTree(params) {
  return request(`/departments?${stringify(params)}`);
}

/**
 * 按条件查询用户列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageUser(params) {
  return request(`/users?${stringify(params)}`);
}

/**
 * 添加用户。
 * @param params
 * @returns {Promise<void>}
 */
export async function addUser(params) {
  return request.post('/users', {
    data: {
      ...params,
    },
  });
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
 * 更新用户。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateUser(params) {
  const { id, plusDepartmentIds, minusDepartmentIds, ...rest } = params;
  return request.put(`/users/${id}`, {
    data: {
      user: {
        id,
        ...rest,
      },
      plusDepartmentIds,
      minusDepartmentIds,
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
  return request.patch(`/users/${id}/status?${stringify({ status })}`);
}

/**
 * 重置用户密码。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function resetUserPassword(params) {
  const { id, newPassword } = params;
  return request.patch(`/users/${id}/password`, {
    data: {
      newPassword,
    },
  });
}

/**
 * 删除用户。
 * @param id
 * @param departmentId
 * @returns {Promise<void>}
 */
export async function deleteUser(id, departmentId) {
  return request.delete(`/users/${id}`, {
    data: {
      departmentId,
    },
  });
}

/**
 * 批量删除用户。
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteBatchUser(params) {
  return request.delete('/users', {
    data: {
      ...params,
    },
  });
}

/**
 * 查询用户所有角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function listUserRole(params) {
  const { id, ...rest } = params;
  return request(`/users/${id}/roles?${stringify(rest)}`);
}

/**
 * 赋予用户某角色。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function grantUserRole(params) {
  const { id, ...rest } = params;
  return request.post(`/users/${id}/roles`, {
    data: rest,
  });
}
